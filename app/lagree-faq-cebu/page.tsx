import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import type { Metadata } from "next";
import Link from "next/link";

const canonicalPath = "/lagree-faq-cebu";
const title =
  "8Club Lagree FAQ: Common Questions About Lagree Classes in Cebu";
const description =
  "Frequently asked questions about 8Club Lagree in Cebu — how Lagree differs from Pilates, what to wear, class duration, training frequency, age requirements, injuries, and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalPath },
  keywords: [
    "lagree faq cebu",
    "lagree cebu faq",
    "lagree vs pilates",
    "lagree class questions",
    "lagree cebu frequently asked questions",
    "megaformer class faq",
    "lagree for beginners cebu",
    "lagree class duration",
    "lagree training frequency",
    "best lagree cebu",
  ],
  openGraph: {
    title,
    description,
    type: "article",
    url: canonicalPath,
    siteName: "8ClubLagree",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const faqs = [
  {
    id: "lagree-vs-pilates",
    question: "How is Lagree Fitness different from Pilates?",
    answer:
      "While Lagree and Pilates may look similar, they serve different purposes. Pilates focuses on rehabilitation, alignment, flexibility, and core control at a low intensity. Lagree is a high-intensity, low-impact, full-body workout designed to build muscular strength, endurance, cardiovascular fitness, and mental toughness. Lagree uses slow, controlled movements with minimal rest to keep muscles under constant tension, maximizing results. The Megaformer was inspired by the Pilates reformer but is specifically engineered to support the Lagree method and its performance-driven goals.",
  },
  {
    id: "purchase-sessions",
    question: "How do I purchase sessions?",
    answer:
      "You can purchase sessions directly through our website or via our studio front desk. If you choose to pay in-studio, our team will assist you with setting up your account online to activate your class credits.",
  },
  {
    id: "training-frequency",
    question: "How often should I train?",
    answer:
      "For best results, we recommend 2-3 sessions per week. Lagree works all major muscle groups at once, so your body benefits most with consistency and proper recovery between classes.",
  },
  {
    id: "arrival-time",
    question: "How early should I come to class?",
    answer:
      "If it's your first time, please arrive 15 minutes early for a short orientation on how to use the Megaformer safely and effectively. Regular clients should arrive 10 to 15 minutes before class to check in, settle, and prepare for the session.",
  },
  {
    id: "class-duration",
    question: "How long does each class last?",
    answer:
      "Each 8Club Lagree session lasts 45 minutes — designed to challenge your body efficiently within a short time frame.",
  },
  {
    id: "what-to-wear",
    question: "What should I wear and bring to class?",
    answer:
      "Wear comfortable, form-fitting activewear that allows fluid movement. Grip socks are required for safety and hygiene — they help with stability on the Megaformer. Please avoid wearing jewelry during class and store valuables in the available lockers.",
  },
  {
    id: "children-policy",
    question: "Are children allowed in the studio?",
    answer:
      "To maintain focus and safety, children are not allowed inside the training area. However, they may wait in the lounge area accompanied by a guardian.",
  },
  {
    id: "experience-needed",
    question: "Do I need experience to join a Lagree class?",
    answer:
      "Not at all. Lagree is suitable for all fitness levels. Our Lagree certified instructors will guide you through every movement and help you modify exercises as needed.",
  },
  {
    id: "injuries",
    question: "Can I join if I have an injury or physical limitation?",
    answer:
      "We recommend consulting your physician or physical therapist before starting. If cleared, please inform your 8Club Lagree instructor before class so we can adjust movements and intensity to fit your needs safely.",
  },
  {
    id: "for-everyone",
    question: "Is Lagree good for everyone?",
    answer:
      "Absolutely. Lagree is one of the most effective workouts for building strength, endurance, and core stability — all while being safe and joint-friendly.",
  },
];

export default function LagreeFaqCebuPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: canonicalPath,
    author: [{ "@type": "Organization", name: "8ClubLagree" }],
    publisher: { "@type": "Organization", name: "8ClubLagree" },
    about: [
      "Lagree FAQ",
      "Fitness studio questions",
      "Lagree Cebu",
      "Megaformer workout",
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <UnauthenticatedLayout>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <div className="mx-auto max-w-3xl px-4 pt-[30px] pb-10 sm:py-14">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700">
              Home
            </Link>{" "}
            <span className="mx-2">/</span>
            <span className="text-slate-700">FAQ</span>
          </nav>

          <header className="mt-5">
            <h1 className="halyard text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              Everything you need to know about Lagree classes at 8Club in Cebu
              — from what to expect on your first visit to how often you should
              train.
            </p>
          </header>

          <article className="mt-10 space-y-10">
            {/* Table of Contents */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                Quick links
              </h2>
              <ul className="mt-3 grid gap-2 text-slate-700 sm:grid-cols-2">
                {faqs.map((faq) => (
                  <li key={faq.id}>
                    <a href={`#${faq.id}`} className="hover:underline">
                      {faq.question}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ Items */}
            <section className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  id={faq.id}
                  className="rounded-2xl border border-slate-200 p-5 sm:p-6"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    {faq.question}
                  </h2>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </section>

            {/* CTA */}
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Still have questions?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Reach out to us on Instagram or drop by{" "}
                <strong>8ClubLagree</strong> in Cebu — we&apos;re happy to help.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-[#800020] px-5 py-3 font-semibold text-white hover:bg-[#800020]/90"
                >
                  Book a Class
                </Link>
                <Link
                  href="/packages"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-100"
                >
                  View Packages
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                First time?{" "}
                <Link
                  href="/beginner-lagree-cebu"
                  className="underline hover:no-underline"
                >
                  Read the beginner guide
                </Link>{" "}
                or review our{" "}
                <Link
                  href="/studio-guidelines"
                  className="underline hover:no-underline"
                >
                  studio guidelines
                </Link>
                .
              </p>
            </section>
          </article>
        </div>
      </UnauthenticatedLayout>
    </main>
  );
}
