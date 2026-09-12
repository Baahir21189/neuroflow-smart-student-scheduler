import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/problem-solution")({
  head: () => ({
    meta: [
      { title: "Problem & Solution — NeuroFlow" },
      {
        name: "description",
        content:
          "Why student scheduling fails and how NeuroFlow uses neuroscience-backed planning to fix it.",
      },
      { property: "og:title", content: "Problem & Solution — NeuroFlow" },
      {
        property: "og:description",
        content: "Why student scheduling fails and how NeuroFlow fixes it.",
      },
    ],
  }),
  component: ProblemPage,
});

function ProblemPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-32 pt-36">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Problem &amp; Solution</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          This page is coming next — it will lay out the research behind why student schedules
          break down, and how NeuroFlow rebuilds them.
        </p>
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Content placeholder
        </div>
      </motion.div>
    </div>
  );
}
