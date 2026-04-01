import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import type { Metadata } from "next";
import Link from "next/link";

const canonicalPath = "/best-workouts-cebu-2026";
const title = "Best Workouts in Cebu (2026 Guide): Gym, Pilates, HIIT, and Lagree";
const description =
  "Compare gym, HIIT, Pilates, and Lagree in Cebu. Learn the pros, cons, and best workout choice for fat loss, strength, and sustainable results in 2026.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalPath },
  keywords: [
    "best workout cebu",
    "cebu fitness guide 2026",
    "gym vs pilates vs hiit",
    "lagree cebu",
    "low impact workout cebu",
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

export default function BestWorkoutsCebu2026Page() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: canonicalPath,
    author: [{ "@type": "Organization", name: "8ClubLagree" }],
    publisher: { "@type": "Organization", name: "8ClubLagree" },
    about: ["Best workout Cebu", "Gym", "HIIT", "Pilates", "Lagree"],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best workout in Cebu for fat loss and strength?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For many people, Lagree is one of the strongest options because it combines low-impact movement with high-intensity full-body training.",
        },
      },
      {
        "@type": "Question",
        name: "Is HIIT or Lagree better for joint-friendly training?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lagree is generally more joint-friendly because it is low-impact while still delivering a high training stimulus.",
        },
      },
      {
        "@type": "Question",
        name: "How do I choose between gym, Pilates, HIIT, and Lagree?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose based on your goals and coaching needs: gym for flexibility and self-directed training, Pilates for alignment and recovery, HIIT for high-paced cardio intensity, and Lagree for efficient low-impact full-body strength and fat loss.",
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
            <span className="text-slate-700">Best Workouts in Cebu (2026)</span>
          </nav>

          <header className="mt-5">
            <h1 className="halyard text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Best Workouts in Cebu (2026 Guide): Gym, Pilates, HIIT, and Lagree
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              Not sure which workout style fits your goals? This guide compares Cebu&apos;s most
              popular options so you can choose based on results, sustainability, and coaching
              support.
            </p>
          </header>

          <article className="mt-10 space-y-10">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">In this guide</h2>
              <ul className="mt-3 grid gap-2 text-slate-700 sm:grid-cols-2">
                <li>
                  <a href="#gym" className="hover:underline">
                    Traditional gym training
                  </a>
                </li>
                <li>
                  <a href="#hiit" className="hover:underline">
                    HIIT and circuit training
                  </a>
                </li>
                <li>
                  <a href="#pilates" className="hover:underline">
                    Pilates
                  </a>
                </li>
                <li>
                  <a href="#lagree" className="hover:underline">
                    Lagree
                  </a>
                </li>
              </ul>
            </section>

            <section id="gym">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                1) Traditional gym training
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Great for flexible schedules and equipment access, especially if you already know
                how to program your sessions.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="font-semibold text-slate-900">Pros</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Flexible timing</li>
                    <li>Wide equipment access</li>
                    <li>Solid for strength development</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <h3 className="font-semibold text-slate-900">Cons</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Easy to plateau without structure</li>
                    <li>Self-discipline required</li>
                    <li>Limited coaching for many members</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="hiit">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                2) HIIT and circuit training
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Fast-paced, calorie-focused workouts that can be motivating for people who enjoy
                high energy classes.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="font-semibold text-slate-900">Pros</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>High calorie burn</li>
                    <li>Energetic and engaging format</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <h3 className="font-semibold text-slate-900">Cons</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Higher-impact on joints</li>
                    <li>Can be difficult for beginners</li>
                    <li>Greater burnout risk if overdone</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="pilates">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                3) Pilates (reformer and mat)
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                A low-impact method centered on alignment, posture, and core control.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="font-semibold text-slate-900">Pros</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Excellent for posture and mobility</li>
                    <li>Strong option for rehabilitation work</li>
                    <li>Beginner-friendly progression</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <h3 className="font-semibold text-slate-900">Cons</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Lower intensity for fat-loss goals</li>
                    <li>Body composition changes may be slower</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="lagree">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                4) Lagree (Megaformer workout)
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Lagree combines strength, cardio challenge, and core work into one low-impact class.
                For people targeting fat loss, muscle tone, and training efficiency, it is one of
                the strongest options in Cebu today.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="font-semibold text-slate-900">Pros</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Low-impact but high-intensity</li>
                    <li>Full-body in about 45 minutes</li>
                    <li>Visible strength and tone progress</li>
                    <li>Structured, coach-led format</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <h3 className="font-semibold text-slate-900">Cons</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>More challenging than Pilates</li>
                    <li>Coaching quality affects outcomes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                How to choose the right workout
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>Do you want guided coaching or self-directed sessions?</li>
                <li>Are you prioritizing fat loss, strength, flexibility, or recovery?</li>
                <li>Do you need low-impact training for long-term sustainability?</li>
              </ul>
              <p className="mt-4 text-slate-700 leading-relaxed">
                If your target is efficient, low-impact, full-body results, Lagree is often the
                best fit.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Final verdict for Cebu in 2026
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Every training style has value, but for strength, fat loss, and time efficiency
                with less joint stress, Lagree stands out. If you want to try it with close
                coaching and controlled execution, <strong>8ClubLagree</strong> is built for that
                experience.
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
                  Compare Packages
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                New to this method? Start with{" "}
                <Link href="/beginner-lagree-cebu" className="underline hover:no-underline">
                  beginner Lagree Cebu
                </Link>{" "}
                and then review{" "}
                <Link href="/lagree-vs-pilates-cebu" className="underline hover:no-underline">
                  Lagree vs Pilates in Cebu
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
