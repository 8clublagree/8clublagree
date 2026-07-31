import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import membershipStyles from "@/components/membership/MembershipExperience.module.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Cake,
  Check,
  Crown,
  Gift,
  Handshake,
  Infinity as InfinityIcon,
  Mail,
  MapPin,
} from "lucide-react";

const canonicalPath = "/lifetime-membership";
const title = "88 Lifetime Membership";
const description =
  "Meet THE 88 Lifetime Members of 8CLUB Lagree Cebu. Learn how to earn the exclusive Lifetime Card, unlock member benefits, and join the first 88.";

const benefits = [
  {
    icon: InfinityIcon,
    title: "8% lifetime discount",
    description:
      "Save 8% on all regular-priced 8CLUB class packages, excluding promotional offers.",
  },
  {
    icon: Cake,
    title: "Annual birthday pass",
    description:
      "Receive one complimentary credit in any scheduled group class during your birth month with an active package.",
  },
  {
    icon: Handshake,
    title: "Partner privileges",
    description: "Access exclusive discounts and privileges across THE 88 partner network.",
  },
  {
    icon: Gift,
    title: "Exclusive tote bag",
    description: "Receive a tote bag created exclusively for THE 88 Lifetime Members.",
  },
  {
    icon: BadgeCheck,
    title: "Numbered Lifetime Card",
    description: "Own THE 88 Lifetime Card bearing your unique member number from #001 to #088.",
  },
];

const partners = [
  {
    name: "Lilo Active",
    image: "/images/membership-page/partners-marketing/8CLUB LC Partners-03.jpg",
    alt: "Models wearing Lilo Active apparel, THE 88 official activewear partner",
    href: "https://liloactive.shop",
  },
  {
    name: "Summit Recovery",
    image: "/images/membership-page/partners-marketing/8CLUB LC Partners-02.jpg",
    alt: "Sauna accessories from Summit Recovery, THE 88 official recovery studio",
    href: "https://www.instagram.com/summitrecoverycebu",
  },
  {
    name: "Better Food Market",
    image: "/images/membership-page/partners-marketing/8CLUB LC Partners-04.jpg",
    alt: "Healthy snacks at Better Food Market, THE 88 official wellness market",
    href: "https://www.instagram.com/betterfoodmarket",
  },
  {
    name: "Happy Hippos",
    image: "/images/membership-page/partners-marketing/8CLUB LC Partners-05.jpg",
    alt: "A Happy Hippos smoothie, THE 88 official healthy eats partner",
    href: "https://www.instagram.com/happyhipposcafe",
  },
];

const faqs = [
  {
    question: "How do I become one of THE 88 Lifetime Members?",
    answer:
      "Complete both the Progress Card and Progress Card Plus for a total of 48 sessions. The first 88 members to complete both milestone cards will become one of THE 88 Lifetime Members and receive THE 88 Lifetime Card. Once all 88 cards have been awarded, no additional recipients will be added.",
  },
  {
    question: "What happens after all 88 Lifetime Cards have been awarded?",
    answer:
      "THE 88 is a one-time recognition. Once all 88 Lifetime Cards have been awarded, the recognition will officially close. 8CLUB may introduce future loyalty initiatives, but THE 88 Lifetime Members will always remain exclusive to its original recipients.",
  },
  {
    question: "Is my recognition permanent?",
    answer:
      "Yes. Your recognition is permanent. To keep your benefits active, attend at least one class or purchase at least one package every 60 days. If you do not, your benefits will pause temporarily and automatically return after your next class attendance or package purchase.",
  },
  {
    question: "Can I transfer my THE 88 Lifetime Card?",
    answer:
      "No. THE 88 Lifetime Card is strictly non-transferable and may only be used by its original recipient.",
  },
  {
    question: "What happens if I lose my Lifetime Card?",
    answer:
      "A lost, stolen, or damaged card may be replaced for a ₱500 fee. Your recognition and benefits remain unchanged. Once a replacement is issued, the original card is deactivated and considered void.",
  },
  {
    question: "Can partner benefits change?",
    answer:
      "Yes. Partner benefits depend on partner participation and availability. Partners and offers may be added, modified, or discontinued from time to time.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalPath },
  keywords: [
    "The 88 Lifetime Members",
    "8CLUB lifetime card",
    "8CLUB Lagree Cebu",
    "Lagree loyalty program Cebu",
    "Lagree membership benefits",
    "lagree members Cebu",
    "lagree membership",
    "best lagree membership",
    "lagree membership benefits",
    "lagree membership benefits Cebu",
    "lagree membership benefits Philippines",
    "lagree membership benefits Philippines",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: canonicalPath,
    siteName: "8CLUB Lagree",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function The88FoundingLifetimeMembersPage() {
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalPath,
    about: {
      "@type": "Thing",
      name: "The 88 Lifetime Members",
      description:
        "8CLUB's permanent recognition for the first 88 members to complete 48 milestone sessions.",
    },
    publisher: {
      "@type": "Organization",
      name: "8CLUB Lagree",
      url: "https://www.8clublagree.com",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <main className="bg-[#f7f4ef] text-[#241f1b]">
      <UnauthenticatedLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <div className={membershipStyles.experience}>
          <div className="overflow-hidden bg-[#f7f4ef]">
            <section className="relative isolate border-b border-[#d8c9b8] bg-[#251b1d] text-white">
              <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(circle_at_80%_20%,#800020_0,transparent_42%),radial-gradient(circle_at_20%_80%,#5d442f_0,transparent_38%)]" />
              <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-24 lg:min-h-[760px] lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-28">
                <div>
                  <h1
                    data-reveal
                    data-delay="2"
                    className="halyard max-w-3xl text-[2.6rem] font-normal leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl"
                  >
                    The 88 Lifetime Members
                  </h1>
                  <p
                    data-reveal
                    data-delay="3"
                    className="halyard mt-6 text-xl text-[#e6d4bf] sm:text-2xl"
                  >
                    The first 88. Forever recognized.
                  </p>
                  <p
                    data-reveal
                    data-delay="3"
                    className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg"
                  >
                    Honoring the first members whose consistency, commitment, and belief in 8CLUB
                    helped shape the foundation of our community.
                  </p>
                </div>

                <div
                  data-hero-media
                  data-reveal="right"
                  data-delay="2"
                  className="relative mx-auto w-full max-w-[380px] sm:max-w-[460px]"
                >
                  <div className="absolute inset-x-10 bottom-8 top-12 rounded-full bg-[#800020]/35 blur-3xl" />
                  <div
                    data-tilt
                    data-shimmer
                    className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-2xl shadow-black/50 sm:rounded-[2rem]"
                  >
                    <Image
                      src="/images/membership-page/membership-cards/lifetime-floating.png"
                      alt="THE 88 Lifetime Cards suspended against a dark backdrop"
                      fill
                      priority
                      sizes="(min-width: 1024px) 460px, (min-width: 640px) 55vw, calc(100vw - 40px)"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                  </div>
                  <p className="mt-5 text-center text-[0.65rem] uppercase tracking-[0.24em] text-white/45 sm:text-xs">
                    Only 88 will ever be awarded
                  </p>
                </div>
              </div>
            </section>

            <section id="overview" className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24">
              <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
                <div data-reveal="left" className="relative">
                  <div className="absolute -inset-5 rounded-[2.5rem] bg-[#800020]/[0.06] blur-2xl" />
                  <div className="relative aspect-[6/5] overflow-hidden rounded-[2rem] border border-[#d8c9b8] bg-[#171313] shadow-xl shadow-[#3d2920]/10">
                    <Image
                      src="/images/membership-page/membership-cards/lifetime-back.png"
                      alt="A hand presenting the matte black 8CLUB Lifetime Card"
                      fill
                      sizes="(min-width: 1024px) 520px, calc(100vw - 40px)"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                  </div>
                </div>
                <div data-reveal="right">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#800020]">
                    A permanent place in our story
                  </p>
                  <h2 className="halyard mt-6 text-3xl leading-tight sm:text-4xl">
                    The highest recognition awarded by 8CLUB
                  </h2>
                  <div className="mt-6 space-y-5 text-base leading-8 text-[#625950] sm:text-lg">
                    <p>
                      Reserved exclusively for the first 88 members who complete both the Progress
                      Card and Progress Card Plus—48 sessions in total—this recognition celebrates
                      the individuals whose dedication helped shape the beginning of the 8CLUB
                      community.
                    </p>
                    <p>
                      More than a card, it is a lasting symbol of commitment, progress, and belonging
                      to a group that will always remain part of 8CLUB&apos;s story.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="how-to-earn"
              className="scroll-mt-20 bg-white px-5 py-16 sm:px-8 sm:py-24"
            >
              <div className="mx-auto max-w-6xl">
                <div data-reveal className="mx-auto max-w-3xl text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#800020]">
                    How to earn THE 88 Lifetime Card
                  </p>
                  <h2 className="halyard mt-4 text-3xl sm:text-5xl">48 sessions. Two milestones. One legacy.</h2>
                  <p className="mt-5 leading-7 text-[#6c6259]">
                    Complete both milestone cards. The first 88 members to finish the journey become
                    THE 88 Lifetime Members.
                  </p>
                </div>

                <div className="relative mt-14 grid gap-6 md:grid-cols-2">
                  <div
                    data-reveal="left"
                    data-tilt
                    className="overflow-hidden rounded-[1.5rem] border border-[#ded4c8] bg-[#f8f5f0] p-3 sm:rounded-[2rem] sm:p-4"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden rounded-[1.4rem] bg-black">
                      <Image
                        src="/images/membership-page/membership-cards/progress-normal.png"
                        alt="The white 8CLUB Progress Card displayed under a spotlight"
                        fill
                        sizes="(min-width: 768px) 50vw, calc(100vw - 64px)"
                        className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                      />
                    </div>
                    <div className="px-3 pb-4 pt-6 sm:px-4 sm:pb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#800020]">
                          Milestone 01
                        </span>
                        <span className="halyard text-3xl text-[#800020]">24</span>
                      </div>
                      <h3 className="halyard mt-5 text-3xl">Progress Card</h3>
                      <p className="mt-2 text-sm leading-6 text-[#756a60]">
                        Build the habit. Complete your first 24 sessions.
                      </p>
                    </div>
                  </div>

                  <div
                    data-reveal="right"
                    data-delay="1"
                    data-tilt
                    className="overflow-hidden rounded-[1.5rem] border border-[#800020]/30 bg-[#2c2022] p-3 text-white sm:rounded-[2rem] sm:p-4"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden rounded-[1.4rem] bg-[#800020]">
                      <Image
                        src="/images/membership-page/membership-cards/progress-plus.png"
                        alt="The black 8CLUB Progress Card Plus shown open against a burgundy backdrop"
                        fill
                        sizes="(min-width: 768px) 50vw, calc(100vw - 64px)"
                        className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                      />
                    </div>
                    <div className="px-3 pb-4 pt-6 sm:px-4 sm:pb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#dfc69f]">
                          Milestone 02
                        </span>
                        <span className="halyard text-3xl text-[#dfc69f]">48</span>
                      </div>
                      <h3 className="halyard mt-5 text-3xl">Progress Card Plus</h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        Continue your commitment with 24 more sessions.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  data-reveal
                  className="mx-auto mt-8 flex max-w-3xl items-start gap-4 rounded-2xl border border-[#e2d8cd] bg-[#fbf8f4] p-5"
                >
                  <Crown className="mt-0.5 h-5 w-5 shrink-0 text-[#800020]" aria-hidden="true" />
                  <p className="text-sm leading-6 text-[#665c53]">
                    Once all 88 Lifetime Cards have been awarded, this founding recognition will
                    officially close.
                  </p>
                </div>
              </div>
            </section>

            <section id="benefits" className="px-5 py-16 sm:px-8 sm:py-24">
              <div className="mx-auto max-w-6xl">
                <div data-reveal className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#800020]">
                    THE 88 benefits
                  </p>
                  <h2 className="halyard mt-4 text-3xl sm:text-5xl">
                    Reserved for the founding few
                  </h2>
                </div>
                <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-[#dfd3c7] bg-[#dfd3c7] md:grid-cols-2 lg:grid-cols-3">
                  {benefits.map(({ icon: Icon, title: benefitTitle, description: benefitDescription }) => (
                    <div
                      key={benefitTitle}
                      data-reveal
                      data-lift
                      className="bg-[#f7f4ef] p-6 sm:p-8"
                    >
                      <div
                        data-icon
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#800020] text-white"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="halyard mt-7 text-2xl">{benefitTitle}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#6f655c]">{benefitDescription}</p>
                    </div>
                  ))}
                  <div data-reveal data-lift className="flex items-center bg-[#800020] p-7 text-white sm:p-8">
                    <p className="halyard text-2xl leading-snug">
                      Recognition that lasts.
                      <br />
                      Benefits that reward consistency.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="partners" className="bg-[#251b1d] px-5 py-16 text-white sm:px-8 sm:py-24">
              <div className="mx-auto max-w-6xl">
                <div data-reveal className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d5b785]">
                      Exclusive partner network
                    </p>
                    <h2 className="halyard mt-4 max-w-xl text-3xl sm:text-5xl">
                      More value, across a community of partners
                    </h2>
                  </div>
                  <p className="max-w-lg text-sm leading-7 text-white/60 lg:justify-self-end">
                    Present your active THE 88 Lifetime Card to enjoy exclusive offers from
                    participating partners. Offers are subject to partner availability.
                  </p>
                </div>
                <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
                  {partners.map(({ name, image, alt, href }, index) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${name}`}
                      data-reveal
                      data-lift
                      data-delay={index < 4 ? String(index) : undefined}
                      className="group w-[82vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] outline-none transition-colors focus-visible:border-[#d5b785] focus-visible:ring-2 focus-visible:ring-[#d5b785]/40 sm:w-auto sm:shrink"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#faf8f4]">
                        <Image
                          src={image}
                          alt={alt}
                          fill
                          sizes="(min-width: 1024px) 276px, (min-width: 640px) 50vw, 82vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                        />
                      </div>
                      <div className="flex items-center justify-between px-4 py-4">
                        <p className="text-sm font-medium text-white/85">{name}</p>
                        <ArrowUpRight
                          className="h-4 w-4 text-[#d5b785] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </a>
                  ))}
                </div>
                <div
                  data-reveal
                  className="mt-8 rounded-2xl border border-dashed border-white/20 bg-white/[0.025] px-6 py-8 text-center sm:px-10 sm:py-10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d5b785]">
                    The circle is growing
                  </p>
                  <h3 className="halyard mt-3 text-2xl text-white sm:text-3xl">
                    More partner privileges are coming soon.
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/50">
                    We&apos;re thoughtfully expanding THE 88 partner network with brands that share
                    our commitment to movement, wellness, and community.
                  </p>
                </div>
                <p className="mt-5 text-xs text-white/45">
                  Partner privileges are confirmed at the point of use and may change over time.
                </p>
              </div>
            </section>

            <section id="faq" className="bg-white px-5 py-16 sm:px-8 sm:py-24">
              <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.65fr_1.35fr]">
                <div data-reveal>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#800020]">
                    Frequently asked questions
                  </p>
                  <h2 className="halyard mt-4 text-3xl sm:text-4xl">Everything you need to know</h2>
                </div>
                <Accordion
                  data-reveal
                  type="single"
                  collapsible
                  className="border-t border-[#ddd2c6]"
                >
                  {faqs.map(({ question, answer }, index) => (
                    <AccordionItem key={question} value={`faq-${index}`} className="border-[#ddd2c6]">
                      <AccordionTrigger className="py-6 text-left text-base leading-6 text-[#2b2521] hover:no-underline">
                        {question}
                      </AccordionTrigger>
                      <AccordionContent className="pr-8 text-sm leading-7 text-[#6c6259]">
                        {answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            <section id="terms" className="px-5 py-16 sm:px-8 sm:py-24">
              <div
                data-reveal
                className="mx-auto max-w-4xl rounded-[1.5rem] border border-[#ddd1c4] bg-[#fbf9f6] p-6 sm:rounded-[2rem] sm:p-10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#800020]">
                  Terms &amp; conditions
                </p>
                <h2 className="halyard mt-4 text-3xl">The important details</h2>
                <ul className="mt-8 space-y-4 text-sm leading-7 text-[#665d55]">
                  {[
                    "Only the first 88 eligible members to complete both the Progress Card and Progress Card Plus—48 sessions total—will receive THE 88 Lifetime Card.",
                    "THE 88 Lifetime Card is non-transferable and may only be used by its original recipient.",
                    "The 8% lifetime discount applies to regular-priced class packages and cannot be combined with promotional offers unless stated otherwise.",
                    "The complimentary Birthday Group Pass is valid only during the member’s birthday month, requires an active package, and is subject to availability and advance booking.",
                    "Partner benefits depend on partner participation and availability. 8CLUB may modify partner offers, benefits, and program terms.",
                    "Recognition is permanent. To keep benefits active, attend at least one class or purchase one package every 60 days. Paused benefits return after the next attendance or package purchase.",
                    "Lost, stolen, or damaged cards may be replaced for ₱500. The original card becomes void when a replacement is issued.",
                    "Misuse, fraud, or abuse of THE 88 Lifetime Card may result in the suspension or termination of benefits.",
                  ].map((term) => (
                    <li key={term} className="flex gap-3">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-[#800020]" aria-hidden="true" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="bg-[#800020] px-5 py-16 text-white sm:px-8 sm:py-20">
              <div
                data-reveal
                className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    Questions about THE 88?
                  </p>
                  <h2 className="halyard mt-4 text-3xl sm:text-5xl">We&apos;re here to help.</h2>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#800020] transition hover:bg-[#f1dfc2]"
                >
                  Book at 8CLUB
                </Link>
              </div>
            </section>

            <div className="bg-[#f7f4ef] px-5 py-6 text-center text-xs text-[#83786d]">
              Effective Date: July 2026
            </div>
          </div>
        </div>
      </UnauthenticatedLayout>
    </main>
  );
}
