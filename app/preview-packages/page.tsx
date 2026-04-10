import UnauthenticatedLayout from "@/components/layout/UnauthenticatedLayout";
import type { Metadata } from "next";
import Link from "next/link";
import PreviewPackagesClient from "./PreviewPackagesClient";

const canonicalPath = "/preview-packages";
const title = "Lagree Prices Cebu: Packages & Rates | 8CLUB Lagree";
const description =
    "See Lagree class prices in Cebu. 8CLUB Lagree offers flexible packages from single sessions to multi-class bundles — lower rates when you commit to more sessions.";

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: canonicalPath },
    keywords: [
        "lagree prices cebu",
        "lagree cost cebu",
        "lagree packages cebu",
        "megaformer class price cebu",
        "8club lagree pricing",
        "lagree session rates cebu",
        "lagree membership cebu",
    ],
    openGraph: {
        title,
        description,
        type: "website",
        url: canonicalPath,
        siteName: "8ClubLagree",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default function PreviewPackagesPage() {
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        mainEntityOfPage: canonicalPath,
        provider: { "@type": "Organization", name: "8ClubLagree" },
        about: [
            "Lagree pricing",
            "Lagree packages",
            "Megaformer classes Cebu",
            "Fitness studio pricing",
        ],
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How much does Lagree cost in Cebu?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Lagree classes in Cebu generally cost between ₱1,000 to ₱1,500 per session depending on the studio and package. At 8CLUB Lagree Cebu, pricing rewards consistency — the more sessions you take, the lower your cost per class.",
                },
            },
            {
                "@type": "Question",
                name: "Which Lagree package should I choose?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "If you're new, start with a single session or small package. For consistent training, mid-tier packages offer better value. If you're fully committed, larger packages give you the lowest cost per session.",
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

                <div className="mx-[100px]">

                    <div className="px-4 pt-[30px] pb-4 sm:py-14">
                        <nav className="text-sm text-slate-500">
                            <Link href="/" className="hover:text-slate-700">
                                Home
                            </Link>{" "}
                            <span className="mx-2">/</span>
                            <span className="text-slate-700">Packages</span>
                        </nav>

                        <header className="mt-5">
                            <h1 className="halyard text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                                Lagree Prices in Cebu: Packages &amp; Rates
                            </h1>
                            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
                                Looking for Lagree prices in Cebu? At 8CLUB Lagree, we offer flexible packages
                                designed for consistency, progression, and real results.
                            </p>
                        </header>

                        <article className="mt-10 space-y-10">
                            <section>
                                <p className="text-slate-700 leading-relaxed">
                                    Our Lagree classes typically range from ₱1,200 per session, with lower rates
                                    available when you commit to multi-session packages. Each class is a 45-minute,
                                    full-body workout on the Megaformer, designed to build strength, endurance, and core
                                    stability.
                                </p>
                                <p className="mt-4 text-slate-700 leading-relaxed">
                                    Whether you&apos;re starting out or training consistently, our packages are
                                    structured to help you get the most value per session.
                                </p>
                                <p className="mt-4 text-slate-700 leading-relaxed">
                                    Lagree classes in Cebu generally cost between P1,000 to P1,500 per session depending on the studio and package.
                                    At 8CLUB Lagree Cebu, pricing is designed to reward consistency — the more sessions you take, the lower your cost per class.
                                </p>
                                <p className="mt-4 text-slate-700 leading-relaxed">
                                    Which Package Should You Choose?
                                    New: start with a single session or small package
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                    • Consistent: choose mid-tier packages for better value
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                    • Committed: larger packages offer the lowest cost per session
                                </p>
                            </section>
                        </article>
                    </div>

                    <PreviewPackagesClient />
                </div>

                {/* <div className="mx-auto max-w-3xl px-4 pt-4 pb-10 sm:pb-14">
                    <article className="space-y-10">
                        <section>
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                                How Much Does Lagree Cost in Cebu?
                            </h2>
                            <p className="mt-3 text-slate-700 leading-relaxed">
                                Lagree classes in Cebu generally cost between ₱1,000 to ₱1,500 per session
                                depending on the studio and package. At 8CLUB Lagree Cebu, pricing is designed to
                                reward consistency — the more sessions you take, the lower your cost per class.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                                Which Package Should You Choose?
                            </h2>
                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-slate-200 p-5">
                                    <h3 className="font-semibold text-slate-900">New to Lagree</h3>
                                    <p className="mt-2 text-slate-700 leading-relaxed">
                                        Start with a single session or small package to experience the Megaformer and see
                                        if Lagree is right for you.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-5">
                                    <h3 className="font-semibold text-slate-900">Consistent</h3>
                                    <p className="mt-2 text-slate-700 leading-relaxed">
                                        Choose mid-tier packages for better value per session. Ideal if you train 2–3
                                        times per week.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-5">
                                    <h3 className="font-semibold text-slate-900">Committed</h3>
                                    <p className="mt-2 text-slate-700 leading-relaxed">
                                        Larger packages offer the lowest cost per session — best for those training
                                        consistently and investing in long-term results.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                                Ready to get started?
                            </h2>
                            <p className="mt-3 text-slate-700 leading-relaxed">
                                Pick a package that matches your goals and start training at{" "}
                                <strong>8CLUB Lagree Cebu</strong> — the city&apos;s dedicated Lagree studio on the
                                Megaformer.
                            </p>
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center rounded-xl bg-[#800020] px-5 py-3 font-semibold text-white hover:bg-[#800020]/90"
                                >
                                    Join the Club
                                </Link>
                            </div>
                            <p className="mt-4 text-sm text-slate-600">
                                New to Lagree? Read our{" "}
                                <Link href="/beginner-lagree-cebu" className="underline hover:no-underline">
                                    Beginner Lagree Cebu guide
                                </Link>{" "}
                                to know what to expect in your first class.
                            </p>
                        </section>
                    </article>
                </div> */}
            </UnauthenticatedLayout>
        </main>
    );
}
