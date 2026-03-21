"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { type Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { useMetaEvents } from "@/hooks/useMetaEvents";

interface LeadFormProps {
  lang: Lang;
  city?: string; // passed from city landing pages for geo-targeted CAPI
}

const projectTypes = [
  "Renovation", "New Construction", "Plumbing", "Electrical",
  "Roofing", "HVAC", "Landscaping", "Luxury Remodel", "Other"
];
const projectTypeValues = [
  "renovations", "general", "plumbing", "electrical",
  "roofing", "hvac", "landscaping", "luxury", "other"
];

export default function LeadForm({ lang, city }: LeadFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", projectType: "renovations" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const meta = useMetaEvents();

  // Fire ViewContent when the form mounts (homeowner audience signal)
  useEffect(() => {
    if (city) meta.trackLeadFormView(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = createClient() as any;
      const { error: dbError } = await supabase.from("leads").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        project_type: form.projectType as any,
        language: lang,
        source: "web",
        status: "new",
      });

      if (dbError) throw dbError;

      // ── Fire Meta Lead event (client + CAPI) ──────────────────────────────
      await meta.trackLeadSubmitted(form.email, form.phone, city ?? "usa");

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card cyber-border rounded-2xl p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="font-display font-bold text-xl mb-2">Request Received!</h3>
        <p className="text-muted-foreground text-sm">
          We&apos;ll match you with the top contractor in your area within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="glass-card cyber-border rounded-2xl p-8">
      <h3 className="font-display font-bold text-xl mb-2">Get Your Free Estimate</h3>
      <p className="text-muted-foreground text-sm mb-6">
        Tell us about your project and we&apos;ll connect you with a vetted local contractor.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          required
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-amber"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input-amber"
        />
        <input
          type="email"
          required
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-amber"
        />
        <select
          value={form.projectType}
          onChange={(e) => setForm({ ...form, projectType: e.target.value })}
          className="input-amber"
        >
          {projectTypes.map((label, i) => (
            <option key={projectTypeValues[i]} value={projectTypeValues[i]} className="bg-background">
              {label}
            </option>
          ))}
        </select>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-amber w-full justify-center">
          {loading ? (
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit & Get Matched
            </>
          )}
        </button>
      </form>
    </div>
  );
}
