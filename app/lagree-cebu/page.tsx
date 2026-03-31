import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import type { Metadata } from "next";
import Link from "next/link";

const canonicalPath = "/lagree-cebu";
const title =
  "Lagree Cebu: What It Is, Benefits, Prices, and Where to Try the Best Megaformer Workout";
const description =
  "Complete Lagree Cebu guide: what Lagree is, benefits, beginner tips, class prices, and where to try a properly coached Megaformer workout.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalPath },
  keywords: [
    "lagree cebu",
    "megaformer cebu",
    "lagree workout cebu",
    "lagree cebu price",
    "best lagree studio cebu",
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

export default function LagreeCebuPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: canonicalPath,
    author: [{ "@type": "Organization", name: "8ClubLagree" }],
    publisher: { "@type": "Organization", name: "8ClubLagree" },
    about: ["Lagree", "Megaformer", "Low-impact workout", "Fitness in Cebu"],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Lagree good for weight loss?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Lagree combines strength and endurance, increasing calorie burn while helping you build lean muscle.",
        },
      },
      {
        "@type": "Question",
        name: "How many times a week should I do Lagree?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For most people, 2 to 4 classes per week is ideal for steady progress and recovery.",
        },
      },
      {
        "@type": "Question",
        name: "Is Lagree safe for beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, when classes are coached properly. Movements are low-impact, adjustable, and safer with hands-on guidance.",
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

        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700">
              Home
            </Link>{" "}
            <span className="mx-2">/</span>
            <span className="text-slate-700">Lagree Cebu Guide</span>
          </nav>

          <header className="mt-5">
            <h1 className="halyard text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Lagree Cebu: What It Is, Benefits, Prices, and Where to Try the Best Megaformer
              Workout
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              Looking for a workout in Cebu that delivers real results without stressing your
              joints? Lagree is a high-intensity, low-impact method that combines strength, cardio,
              and core work in one efficient class.
            </p>
          </header>

          <article className="mt-10 space-y-10">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">In this guide</h2>
              <ul className="mt-3 grid gap-2 text-slate-700 sm:grid-cols-2">
                <li>
                  <a href="#what-is-lagree" className="hover:underline">
                    What is Lagree?
                  </a>
                </li>
                <li>
                  <a href="#lagree-vs-pilates" className="hover:underline">
                    Lagree vs Pilates
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="hover:underline">
                    Benefits of Lagree
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:underline">
                    Lagree Cebu prices
                  </a>
                </li>
              </ul>
            </section>

            <section id="what-is-lagree">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                What is Lagree?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Lagree is a full-body workout done on the <strong>Megaformer</strong>. It uses slow,
                controlled movement, constant tension, and precise alignment to challenge your
                muscles safely. A standard class lasts about 45 minutes and trains strength,
                endurance, core stability, and control.
              </p>
            </section>

            <section id="lagree-vs-pilates">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Lagree vs Pilates
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Pilates</h3>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Lower intensity</li>
                    <li>Excellent for alignment and rehab</li>
                    <li>Great for mobility and posture</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Lagree</h3>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Higher intensity, still low-impact</li>
                    <li>Built for strength and endurance</li>
                    <li>Better for fat loss and visible transformation</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-slate-700 leading-relaxed">
                If Pilates helps you feel better, Lagree is often the next step when you want to
                feel stronger and see faster body composition changes.
              </p>
            </section>

            <section id="benefits">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Benefits of Lagree in Cebu
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Fat loss plus lean muscle</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Long time-under-tension makes each set more efficient for calorie burn and tone.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Joint-friendly training</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Lagree is low-impact, so you avoid jumping and pounding while still getting a
                    challenging class.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Core strength and posture</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Controlled movement heavily targets deep core muscles that support better posture
                    and back health.
                  </p>
                </div>
              </div>
            </section>

            <section id="pricing">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Lagree Cebu price guide
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Most Cebu Megaformer classes typically range around <strong>PHP 1,200 to PHP
                  2,200</strong> for a single class, while packages usually lower your per-class rate.
                Final pricing depends on class size, coach quality, and studio standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Who is it for?</h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>Busy professionals who want efficient sessions</li>
                <li>Beginners who need structure and guidance</li>
                <li>Pilates regulars ready for more intensity</li>
                <li>People training for strength, tone, and long-term consistency</li>
              </ul>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Where to try Lagree in Cebu
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                The quality of coaching matters as much as the workout itself. At{" "}
                <strong>8ClubLagree</strong>, classes prioritize precision, controlled movement, and
                hands-on guidance so every rep is safer and more effective.
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
                New to Megaformer? Read our{" "}
                <Link href="/beginner-lagree-cebu" className="underline hover:no-underline">
                  beginner Lagree Cebu guide
                </Link>{" "}
                or compare options in{" "}
                <Link href="/best-workouts-cebu-2026" className="underline hover:no-underline">
                  best workouts in Cebu (2026)
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
