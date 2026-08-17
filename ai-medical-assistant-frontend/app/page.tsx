import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  BrainCircuit,
  CalendarCheck2,
  FileText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Understand your reports",
    description:
      "Upload scans and reports to see AI-powered summaries and key findings in plain language.",
  },
  {
    icon: Sparkles,
    title: "AI symptom guidance",
    description:
      "Check symptoms and review possible explanations with clear next steps and safety guidance.",
  },
  {
    icon: CalendarCheck2,
    title: "Appointments & reminders",
    description:
      "Stay on top of bookings, follow-ups, and important care tasks without the clutter.",
  },
  {
    icon: Stethoscope,
    title: "Doctor access",
    description:
      "Find care options and manage appointments in one place with a patient-first experience.",
  },
];

const steps = [
  "Create your secure account",
  "Upload or connect your health information",
  "Track results, appointments, and reminders",
];

export default function HomePage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Medical Assistant</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="#features">Features</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href="#privacy">Privacy</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-700 md:inline-flex"
            >
              Login
            </Link>
            <Link href="/register">
              <Button className="rounded-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-teal-800">
            <BellRing className="h-3.5 w-3.5" />
            modern healthcare support
          </div>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Healthcare information, simplified.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Understand medical reports, check symptoms, manage appointments, and
            stay organized with a secure, compassionate AI-powered health
            companion.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="rounded-full">
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="rounded-full">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Today&apos;s overview</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  Health snapshot
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Medical reports",
                  value: "AI-powered",
                },
                {
                  label: "Appointments",
                  value: "Organized",
                },
                {
                  label: "Health reminders",
                  value: "On track",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span className="text-sm text-slate-600">{item.label}</span>

                  <span className="text-sm font-semibold text-teal-700">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
            Core capabilities
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Health support designed around everyday clarity
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              A simple, human approach to digital care
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-base font-medium text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="privacy"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
                Privacy & security
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                Built with patient trust in mind
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                AI Medical Assistant helps organize health information while
                keeping the experience secure, clear, and medically responsible.
                Data is handled with careful access controls and privacy-minded
                UX.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Secure authentication and session handling",
                "Clear medical disclaimers around AI-generated information",
                "Responsible healthcare experience and patient-centered design",
              ].map((bullet) => (
                <div
                  key={bullet}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-700" />
                  <p className="text-sm text-slate-700">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-14 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
              Ready when you are
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              Take control of your care journey.
            </h2>
          </div>
          <Link href="/register">
            <Button size="lg" className="rounded-full">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500 sm:px-6 lg:px-8">
        © 2026 AI Medical Assistant. Designed for informed, proactive healthcare
        management.
      </footer>
    </main>
  );
}
