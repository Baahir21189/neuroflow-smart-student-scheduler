import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, MoonStar, Activity, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroFlow — Neuroscience-Backed Weekly Scheduler" },
      {
        name: "description",
        content:
          "NeuroFlow helps university students plan academic and personal life around how the brain actually focuses, rests and recovers.",
      },
      { property: "og:title", content: "NeuroFlow — Neuroscience-Backed Weekly Scheduler" },
      {
        property: "og:description",
        content:
          "A smart weekly scheduler that balances study, rest and life using neuroscience-backed planning.",
      },
    ],
  }),
  component: HomePage,
});

const features = [
  {
    icon: Activity,
    title: "Energy-aware planning",
    body: "Tasks land in the hours your focus actually peaks, not whenever there is a gap.",
  },
  {
    icon: MoonStar,
    title: "Recovery built in",
    body: "Sleep, breaks and downtime are scheduled first — they are what make study work.",
  },
  {
    icon: Sparkles,
    title: "One clear week",
    body: "Academic and personal life on a single calm surface you can read in seconds.",
  },
];

function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-32 pt-28">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Built on neuroscience research
        </span>
        <h1 className="mx-auto mt-8 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Plan your week the way your <span className="text-primary">brain</span> works.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          NeuroFlow is a smart weekly scheduler for university students — balancing lectures,
          deadlines, rest and real life around your natural focus rhythms.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/scheduler"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open the scheduler
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/problem-solution"
            className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Problem &amp; Solution
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-5 sm:grid-cols-3">
        {features.map((feature, i) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <feature.icon className="size-5 text-primary" />
            <h2 className="mt-5 text-base font-medium">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
