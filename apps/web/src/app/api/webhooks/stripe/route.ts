import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ─── Clients ────────────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Tier mapping ────────────────────────────────────────────────────────────
const PRICE_TO_TIER: Record<string, Database["public"]["Enums"]["subscription_tier"]> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL ?? ""]:  "professional",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_DOMINATOR ?? ""]:      "dominator",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_EMPIRE ?? ""]:    "empire",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function getProfileByCustomerId(customerId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  return data;
}

async function updateSubscription(
  customerId: string,
  tier: Database["public"]["Enums"]["subscription_tier"],
  status: string,
  subscriptionId: string | null
) {
  const profile = await getProfileByCustomerId(customerId);
  if (!profile) {
    console.error(`[stripe-webhook] No profile found for customer ${customerId}`);
    return;
  }

  await supabase
    .from("profiles")
    .update({
      subscription_tier: tier,
      subscription_status: status,
      stripe_subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", profile.id);

  // Log the automation event
  await supabase.from("automation_log").insert({
    contractor_id: profile.id,
    event_type: "subscription_updated",
    payload: { tier, status, stripe_subscription_id: subscriptionId },
    created_at: new Date().toISOString(),
  } as never);
}

// ─── Route handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[stripe-webhook] Processing event: ${event.type}`);

  try {
    switch (event.type) {
      // ── Checkout completed → activate subscription ──────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Fetch the subscription to get the price ID
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? "";
        const tier = PRICE_TO_TIER[priceId] ?? "professional";

        await updateSubscription(customerId, tier, "active", subscriptionId);

        // If the customer has a userId in metadata, link it
        if (session.metadata?.userId) {
          await supabase
            .from("profiles")
            .update({ stripe_customer_id: customerId } as never)
            .eq("id", session.metadata.userId);
        }
        break;
      }

      // ── Subscription updated (upgrade/downgrade) ─────────────────────────
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const priceId = sub.items.data[0]?.price.id ?? "";
        const tier = PRICE_TO_TIER[priceId] ?? "professional";
        const status = sub.status === "active" ? "active" : sub.status;

        await updateSubscription(customerId, tier, status, sub.id);
        break;
      }

      // ── Subscription deleted/cancelled ───────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        await updateSubscription(customerId, "free" as never, "cancelled", null);
        break;
      }

      // ── Invoice paid → ensure active ────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscriptionId = (invoice as { subscription?: string }).subscription ?? null;

        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = sub.items.data[0]?.price.id ?? "";
          const tier = PRICE_TO_TIER[priceId] ?? "professional";
          await updateSubscription(customerId, tier, "active", subscriptionId);
        }
        break;
      }

      // ── Invoice payment failed → flag account ────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const profile = await getProfileByCustomerId(customerId);
        if (profile) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "past_due" } as never)
            .eq("id", profile.id);
        }
        break;
      }

      default:
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[stripe-webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
