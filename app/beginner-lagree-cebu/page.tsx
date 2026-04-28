import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import type { Metadata } from "next";
import Link from "next/link";

const canonicalPath = "/beginner-lagree-cebu";
const title = "Beginner Lagree Cebu: Your First Class Guide (What to Expect + Tips)";
const description =
  "Beginner Lagree Cebu guide: what to expect in your first class, what to bring, common mistakes to avoid, and how often to train for results.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalPath },
  keywords: [
    "beginner lagree cebu",
    "first lagree class cebu",
    "lagree for beginners",
    "megaformer beginner guide",
    "what to expect lagree",
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

export default function BeginnerLagreeCebuPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: canonicalPath,
    author: [{ "@type": "Organization", name: "8ClubLagree" }],
    publisher: { "@type": "Organization", name: "8ClubLagree" },
    about: ["Beginner fitness", "Lagree", "Megaformer", "Workout guide Cebu"],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need to be fit before my first Lagree class?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Lagree is scalable and beginner-friendly, with movements and resistance that can be adjusted to your level.",
        },
      },
      {
        "@type": "Question",
        name: "What should I bring to a beginner Lagree class?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bring grip socks, water, and comfortable workout clothes.",
        },
      },
      {
        "@type": "Question",
        name: "How often should beginners do Lagree?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Start with 2 to 3 classes per week to balance consistency with recovery.",
        },
      },
    ],
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
            <span className="text-slate-700">Beginner Lagree Cebu</span>
          </nav>

          <header className="mt-5">
            <h1 className="halyard text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Beginner Lagree Cebu: Your First Class Guide (What to Expect + Tips)
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              First class nerves are normal. This guide shows exactly what happens in a beginner
              Lagree class in Cebu so you can walk in confident and prepared.
            </p>
          </header>

          <article className="mt-10 space-y-10">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">In this guide</h2>
              <ul className="mt-3 grid gap-2 text-slate-700 sm:grid-cols-2">
                <li>
                  <a href="#beginner-friendly" className="hover:underline">
                    Is Lagree beginner-friendly?
                  </a>
                </li>
                <li>
                  <a href="#first-class" className="hover:underline">
                    First class expectations
                  </a>
                </li>
                <li>
                  <a href="#bring" className="hover:underline">
                    What to bring
                  </a>
                </li>
                <li>
                  <a href="#frequency" className="hover:underline">
                    Weekly training frequency
                  </a>
                </li>
              </ul>
            </section>

            <section id="beginner-friendly">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Is Lagree good for beginners?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Yes. Lagree is high-intensity but still beginner-friendly when coached properly.
                Movement is controlled, resistance is adjustable, and instructors can modify
                positions based on your level.
              </p>
            </section>

            <section id="first-class">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                What to expect in your first class
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Before class</h3>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Arrive 10 to 15 minutes early</li>
                    <li>Get a quick Megaformer walkthrough</li>
                    <li>Learn basic setup and safety cues</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">During class</h3>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Very slow reps with constant tension</li>
                    <li>Muscle shaking is normal and expected</li>
                    <li>Minimal rest keeps class efficient</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">After class</h3>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Soreness is common, especially in new muscle groups</li>
                    <li>Recovery and hydration matter</li>
                    <li>Consistency drives your results</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="bring">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                What to bring to your first Lagree class
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>Grip socks (required)</li>
                <li>Water</li>
                <li>Comfortable training clothes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Beginner tips that actually help
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">1) Go slower than you think</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    In Lagree, slower movement increases time under tension and improves results.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">2) Prioritize form over range</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Clean form beats bigger movement. Quality reps protect your joints and build
                    better strength.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">3) Do not compare your pace</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Everyone starts somewhere. Follow cues, make adjustments, and focus on your own
                    progress.
                  </p>
                </div>
              </div>
            </section>

            <section id="frequency">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                How often should beginners train?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Start with <strong>2 to 3 classes per week</strong>. This gives you enough training
                frequency to improve while allowing recovery between sessions.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Ready for your first class?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                At <strong>8ClubLagree</strong>, beginner classes emphasize clear coaching,
                corrections, and confidence-building so your first session is safe and productive.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-[#800020] px-5 py-3 font-semibold text-white hover:bg-[#800020]/90"
                >
                  Book a First Class
                </Link>
                {/* <Link
                  href="/packages"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-100"
                >
                  See Intro Packages
                </Link> */}
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Want a complete overview first? See{" "}
                <Link href="/lagree-cebu" className="underline hover:no-underline">
                  Lagree Cebu: what it is, benefits, and prices
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
