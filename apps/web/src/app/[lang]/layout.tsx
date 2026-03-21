import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLang, type Lang } from "@/lib/i18n";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    alternates: {
      canonical: `https://trades-usa.com/${lang}`,
    },
    openGraph: {
      locale: "en_US",
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }];
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  return (
    <html lang={lang as Lang} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
