import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import type { Metadata } from "next";
import Link from "next/link";

const canonicalPath = "/lagree-studio-guidelines-cebu";
const title =
  "8Club Lagree Studio Guidelines: Policies, Cancellation & Class Rules";
const description =
  "Complete 8Club Lagree studio guidelines — credit usage, cancellation and rescheduling policies, arrival rules, dress code, age eligibility, private sessions, and package freeze details.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalPath },
  keywords: [
    "8club lagree studio guidelines",
    "lagree cebu cancellation policy",
    "lagree class booking policy cebu",
    "lagree cebu studio rules",
    "megaformer class rules cebu",
    "lagree private session cebu",
    "lagree cebu dress code",
    "lagree package freeze policy",
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

export default function LagreeStudioGuidelinesCebuPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: canonicalPath,
    author: [{ "@type": "Organization", name: "8ClubLagree" }],
    publisher: { "@type": "Organization", name: "8ClubLagree" },
    about: [
      "Studio policies",
      "Lagree class rules",
      "Booking policies",
      "Cebu fitness studio",
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the cancellation policy at 8Club Lagree?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You may cancel at least 24 hours before your scheduled class through your online account to retain your credits. Cancellations made less than 24 hours before the class will result in the credit being deducted. No-shows will also have the credit deducted.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods does 8Club Lagree accept?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "8Club Lagree accepts debit cards, credit cards, Maya, and GCash for all bookings. Walk-in clients may pay in cash on the day of the class, subject to slot availability.",
        },
      },
      {
        "@type": "Question",
        name: "What should I wear to a Lagree class?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All guests are required to wear grip socks during classes. You may bring your own pair or purchase one at the front desk. Athletic wear that allows comfortable movement is recommended. Bare feet and outdoor shoes are not allowed inside the studio.",
        },
      },
      {
        "@type": "Question",
        name: "How early should I arrive for a Lagree class?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Please arrive 10 to 15 minutes before your scheduled class for check-in, preparation, and a brief orientation on the Megaformer. A grace period of up to 10 minutes is given for latecomers, after which entry will no longer be permitted.",
        },
      },
      {
        "@type": "Question",
        name: "Can I freeze my Lagree package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Package freezes are available for Signature and Elite package holders only. Freezes are allowed for international travel (with airfare proof) or medical conditions (with a doctor's note). Signature packages allow up to 15 days and Elite packages allow up to 30 days of freeze per package.",
        },
      },
      {
        "@type": "Question",
        name: "What is the minimum age for Lagree classes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lagree may not be suitable for individuals under 14 years of age. Ages 14–15 may join only when accompanied by a parent or guardian. Ages 16–17 may participate unaccompanied with a signed consent and liability waiver.",
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
            <span className="text-slate-700">Studio Guidelines</span>
          </nav>

          <header className="mt-5">
            <h1 className="halyard text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              8Club Lagree Studio Guidelines
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              Everything you need to know before your class — credits, booking,
              cancellations, arrival, dress code, and more.
            </p>
          </header>

          <article className="mt-10 space-y-10">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                In this guide
              </h2>
              <ul className="mt-3 grid gap-2 text-slate-700 sm:grid-cols-2">
                <li>
                  <a href="#credit-usage" className="hover:underline">
                    Credit Usage &amp; Validity
                  </a>
                </li>
                <li>
                  <a href="#payment" className="hover:underline">
                    Payment Policy
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="hover:underline">
                    Schedule Policy
                  </a>
                </li>
                <li>
                  <a href="#reschedule" className="hover:underline">
                    Reschedule Policy
                  </a>
                </li>
                <li>
                  <a href="#cancellation" className="hover:underline">
                    Cancellation Policy
                  </a>
                </li>
                <li>
                  <a href="#arrival" className="hover:underline">
                    Arrival &amp; Late Entry
                  </a>
                </li>
                <li>
                  <a href="#age-eligibility" className="hover:underline">
                    Age &amp; Eligibility
                  </a>
                </li>
                <li>
                  <a href="#dress-code" className="hover:underline">
                    Dress Code
                  </a>
                </li>
                <li>
                  <a href="#private-sessions" className="hover:underline">
                    Private Sessions
                  </a>
                </li>
                <li>
                  <a href="#package-freeze" className="hover:underline">
                    Package Freeze
                  </a>
                </li>
                <li>
                  <a href="#sharable-credits" className="hover:underline">
                    Sharable Credits
                  </a>
                </li>
              </ul>
            </section>

            <section id="credit-usage">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Credit Usage and Validity Policy
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>
                  Each class session is equivalent to one (1) credit, which is
                  deducted from your account once a booking is confirmed.
                </li>
                <li>
                  All credits are subject to an expiration date that varies
                  depending on the package purchased. Upon expiry, unused credits
                  will be forfeited and cannot be reinstated.
                </li>
                <li>
                  Credits are strictly non-transferable, non-refundable, and may
                  not be extended beyond their validity period.
                </li>
              </ul>
            </section>

            <section id="payment">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Payment Policy
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>
                  We accept debit cards, credit cards, Maya, and GCash for all
                  bookings.
                </li>
                <li>
                  Sessions and packages must be fully paid prior to the scheduled
                  class.
                </li>
                <li>
                  All payments made are final, non-refundable, and
                  non-transferable.
                </li>
                <li>
                  Walk-in clients may pay in cash on the day of the class,
                  subject to slot availability.
                </li>
              </ul>
            </section>

            <section id="schedule">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Schedule Policy
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Refer to the{" "}
                <Link href="/login" className="underline hover:no-underline">
                  Schedule page
                </Link>{" "}
                for current instructor listings and class times. Instructor
                assignments are subject to change without prior notice.
              </p>
            </section>

            <section id="reschedule">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Class Reschedule Policy
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>
                  Same-day rescheduling may be allowed, subject to slot
                  availability and approval by the studio.
                </li>
                <li>
                  To request a same-day reschedule, please contact us via phone
                  or Instagram.
                </li>
                <li>
                  Rescheduling is only permitted within the same calendar day as
                  the original booking.
                </li>
                <li>
                  If a reschedule cannot be accommodated, the scheduled class
                  will be counted as attended and the credit will be deducted.
                </li>
              </ul>
            </section>

            <section id="cancellation">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Cancellation Policy
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>
                  You may cancel at least{" "}
                  <strong>24 hours before your scheduled class</strong> through
                  your online account to retain your credits.
                </li>
                <li>
                  Cancellations made less than 24 hours before the scheduled
                  class will result in the credit being deducted.
                </li>
                <li>
                  Clients who do not attend their scheduled class (no-show) will
                  also have the credit deducted.
                </li>
                <li>
                  In the event of a medical emergency, a valid medical
                  certificate or supporting document may be submitted for review
                  by the studio.
                </li>
              </ul>
            </section>

            <section id="arrival">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Arrival and Late Entry Policy
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    Before class
                  </h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Arrive <strong>10 to 15 minutes early</strong> for
                    preparation, check-in, and a brief orientation on the
                    Megaformer and proper equipment handling.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    Late arrival
                  </h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    A grace period of up to{" "}
                    <strong>10 minutes</strong> is given for latecomers. Once the
                    grace period has passed, entry will no longer be permitted to
                    ensure safety and avoid disruptions.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    If you miss the window
                  </h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Latecomers may be accommodated in the next available slot
                    within the same day, subject to availability. Otherwise, the
                    session will be marked as attended and the credit forfeited.
                  </p>
                </div>
              </div>
            </section>

            <section id="age-eligibility">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Participant Age and Eligibility
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Lagree is a high-intensity workout and may not be suitable for
                individuals under 14 years of age.
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Ages 14–15</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Participants may join classes only when accompanied by a
                    parent or legal guardian.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Ages 16–17</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    May participate unaccompanied, provided a parent or guardian
                    has signed a consent and liability waiver prior to the class.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    Participants with injuries
                  </h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">
                    Guests with existing or previous injuries are required to
                    inform the instructor prior to class so appropriate
                    modifications can be provided during the session.
                  </p>
                </div>
              </div>
            </section>

            <section id="dress-code">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Studio Dress Code
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>
                  <strong>Grip socks are required</strong> during all classes for
                  safety and hygiene. Bring your own pair or purchase one at the
                  front desk. Bare feet and outdoor shoes are not allowed inside
                  the studio.
                </li>
                <li>
                  Athletic wear that allows comfortable movement is recommended.
                </li>
                <li>
                  Bring a towel and water bottle to stay comfortable and hydrated
                  throughout the session.
                </li>
              </ul>
            </section>

            <section id="private-sessions">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Private Sessions
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>
                  Private sessions must be booked at least{" "}
                  <strong>24 hours in advance</strong>.
                </li>
                <li>Studio buyout requires full payment upon booking.</li>
                <li>
                  The same cancellation and rescheduling policies applicable to
                  group classes also apply to private sessions.
                </li>
                <li>
                  Private sessions are subject to instructor and studio
                  availability. Contact us via Instagram or email to secure a
                  booking.
                </li>
              </ul>
            </section>

            <section id="package-freeze">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Package Freeze Policy
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Available for <strong>Signature</strong> and{" "}
                <strong>Elite</strong> package holders only.
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Eligibility</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>International travel (airfare proof required)</li>
                    <li>
                      Medical condition or injury (medical certificate or
                      doctor&apos;s note required)
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">Conditions</h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>1 freeze allowed per package</li>
                    <li>Minimum 5 consecutive days</li>
                    <li>
                      Freeze request must be submitted before travel or medical
                      leave begins
                    </li>
                    <li>Retroactive freeze requests will not be accepted</li>
                    <li>Freeze applies only to unused sessions</li>
                    <li>Expired packages cannot be revived</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    Maximum freeze duration
                  </h3>
                  <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1.5">
                    <li>
                      <strong>Signature:</strong> up to 15 total days per
                      package
                    </li>
                    <li>
                      <strong>Elite:</strong> up to 30 total days per package
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="sharable-credits">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Sharable Credits
              </h2>
              <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2 leading-relaxed">
                <li>
                  Available only for <strong>Signature</strong> and{" "}
                  <strong>Elite</strong> package holders.
                </li>
                <li>
                  <strong>Signature Package:</strong> 2 sharable credits
                </li>
                <li>
                  <strong>Elite Package:</strong> 4 sharable credits
                </li>
                <li>
                  Sharable credits may be used to book a class for another guest.
                </li>
                <li>
                  To receive a shared credit, the recipient must first create an
                  account on the studio booking website.
                </li>
              </ul>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Ready to book your class?
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Now that you know the studio policies, book your next{" "}
                <strong>8ClubLagree</strong> class with confidence.
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
                New to Lagree?{" "}
                <Link
                  href="/beginner-lagree-cebu"
                  className="underline hover:no-underline"
                >
                  Read the beginner guide
                </Link>{" "}
                or learn more about{" "}
                <Link
                  href="/lagree-cebu"
                  className="underline hover:no-underline"
                >
                  Lagree in Cebu
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
