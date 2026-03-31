"use client";

import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import Link from "next/link";
import { useMemo } from "react";

function getSiteOrigin() {
  // Prefer server-set origin, then public app URL, then a safe production fallback.
  return (
    process.env.SYSTEM_ORIGIN ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://lagree-booking-system.vercel.app"
  ).replace(/\/$/, "");
}

export default function LagreeVsPilatesCebuPage() {
  const origin = useMemo(() => getSiteOrigin(), []);
  const canonicalUrl = `${origin}/lagree-vs-pilates-cebu`;

  const jsonLd = useMemo(() => {
    const headline = "Lagree vs Pilates in Cebu: Which Workout is Better for You?";
    const description =
      "Comparing Lagree and Pilates in Cebu: intensity, results, movement style, equipment (Megaformer vs Reformer), calorie burn, and who each is best for—plus where to try Lagree at 8ClubLagree.";

    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline,
      description,
      mainEntityOfPage: canonicalUrl,
      author: [{ "@type": "Organization", name: "8ClubLagree" }],
      publisher: { "@type": "Organization", name: "8ClubLagree" },
    };

    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Lagree harder than Pilates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Lagree is higher intensity because movements are extremely slow, muscles stay under constant tension, and there’s very little rest—while still being low-impact and joint-safe.",
          },
        },
        {
          "@type": "Question",
          name: "Is Lagree good for beginners?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes—when coached properly. Movements can be adjusted, form is prioritized, and beginners can safely progress quickly with guidance.",
          },
        },
        {
          "@type": "Question",
          name: "Which is better for results: Lagree or Pilates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on your goal. Pilates is great for flexibility, posture, alignment, and gentle strengthening; Lagree is better for strength, muscle tone, higher calorie burn, and faster visible body transformation.",
          },
        },
      ],
    };

    return [article, faq];
  }, [canonicalUrl]);

  return (
    <main className="min-h-screen bg-white">
      <UnauthenticatedLayout>
        {/* Basic SEO helpers for CSR pages. (App already uses Next; metadata can be added later if you want server metadata.) */}
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700">
              Home
            </Link>{" "}
            <span className="mx-2">/</span>
            <span className="text-slate-700">Lagree vs Pilates in Cebu</span>
          </nav>

          <header className="mt-5">
            <h1 className="halyard text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Lagree vs Pilates in Cebu: Which Workout is Better for You?
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              If you’re searching for <strong>Pilates in Cebu</strong>, chances are you’ve also
              come across <strong>Lagree</strong>. They can look similar—both use machines, both
              are low-impact, and both focus on core strength. But they’re not the same workout.
            </p>
          </header>

          <article className="mt-10 space-y-10">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                What is Pilates?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Pilates is a low-impact workout designed to improve flexibility, posture, core
                stability, and body alignment. It’s often used for rehabilitation, injury recovery,
                and gentle strengthening—controlled, but generally lower in intensity.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                What is Lagree?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Lagree is a high-intensity, low-impact, full-body workout performed on the{" "}
                <strong>Megaformer</strong>. It emphasizes slow, controlled movements with constant
                muscle tension to build strength and endurance. Each class is designed to build lean
                muscle, burn fat, and improve overall fitness—often described as the evolution of
                Pilates, built for results.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Lagree vs Pilates: Key Differences
              </h2>

              <div className="mt-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">1) Intensity</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Pilates is typically low intensity. Lagree is high intensity (while still
                    low-impact). If you want to feel challenged and pushed, Lagree wins.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">2) Results</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Pilates improves flexibility and posture, but physical transformation is usually
                    slower. Lagree builds strength and muscle tone with faster fat loss and more
                    visible results—better for body transformation goals.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">3) Movement style</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Pilates often uses faster repetitions and lighter resistance. Lagree uses
                    extremely slow reps (roughly one rep in ~10 seconds) with higher resistance and
                    continuous tension—maximizing time under tension, which drives results.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">4) Equipment</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Pilates is commonly done on a Reformer. Lagree is done on a Megaformer. While they
                    can look similar, the Megaformer is built for higher resistance, continuous
                    tension, and more advanced strength work.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">5) Calorie burn</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Pilates generally has a lower calorie burn. Lagree combines strength + endurance,
                    making it more efficient for fat loss.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Which is better: Lagree or Pilates?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                It depends on your goal.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Choose Pilates if you want</h3>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Rehabilitation</li>
                    <li>Gentle movement</li>
                    <li>Flexibility and posture work</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Choose Lagree if you want</h3>
                  <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>Strength and muscle tone</li>
                    <li>Fat loss</li>
                    <li>A more intense, efficient workout</li>
                    <li>Faster visible results</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-slate-700 leading-relaxed">
                For many people searching “Pilates Cebu”, what they actually want is Lagree-level
                results.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                FAQs
              </h2>
              <div className="mt-4 space-y-4">
                <details className="rounded-2xl border border-slate-200 p-5">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Is Lagree harder than Pilates?
                  </summary>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    Yes—but in a good way. Lagree is more challenging because movements are slower,
                    muscles stay under constant tension, and there’s very little rest. It’s still
                    low-impact and joint-safe, which makes it accessible for beginners.
                  </p>
                </details>

                <details className="rounded-2xl border border-slate-200 p-5">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Is Lagree good for beginners?
                  </summary>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    Yes—if coached properly. Movements can be adjusted, form stays the priority, and
                    you can progress safely and quickly with guidance.
                  </p>
                </details>

                <details className="rounded-2xl border border-slate-200 p-5">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Lagree as a Pilates alternative in Cebu
                  </summary>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    If Pilates no longer challenges you and you want more strength, tone, and faster
                    results, Lagree is the natural next step—this is why many people in Cebu are
                    shifting from Pilates to Lagree.
                  </p>
                </details>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Where to try Lagree in Cebu
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Execution matters more than the workout itself. At <strong>8ClubLagree</strong>, the
                focus is on small class sizes, hands-on coaching, and slow, controlled, intentional
                training to ensure proper form, better results, and lower risk of injury.
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
            </section>
          </article>

          <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
            Brand: <strong className="text-slate-700">8ClubLagree</strong>
          </footer>
        </div>
      </UnauthenticatedLayout>
    </main>
  );
}

