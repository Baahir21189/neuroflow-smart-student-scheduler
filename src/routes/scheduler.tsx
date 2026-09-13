import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, CalendarDays, ListPlus, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { AssessmentQuiz } from "@/components/AssessmentQuiz";
import { isAssessmentComplete, setAssessmentComplete } from "@/lib/assessment";

export const Route = createFileRoute("/scheduler")({
  head: () => ({
    meta: [
      { title: "Scheduler — NeuroFlow" },
      {
        name: "description",
        content:
          "Take the personality assessment, then build a weekly routine tuned to your focus and energy.",
      },
      { property: "og:title", content: "Scheduler — NeuroFlow" },
      {
        property: "og:description",
        content: "Build a weekly routine tuned to your focus and energy.",
      },
    ],
  }),
  component: SchedulerPage,
});

const tabs = [
  { id: "assessment", label: "Personality Assessment", icon: Brain, locked: false },
  { id: "routine", label: "My Weekly Routine", icon: CalendarDays, locked: true },
  { id: "tasks", label: "New Tasks & Events", icon: ListPlus, locked: true },
  { id: "profile", label: "My Profile", icon: User, locked: true },
] as const;

type TabId = (typeof tabs)[number]["id"];

function SchedulerPage() {
  const [active, setActive] = useState<TabId>("assessment");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const sync = () => setUnlocked(isAssessmentComplete());
    sync();
    window.addEventListener("neuroflow:assessment-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("neuroflow:assessment-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const activeTab = tabs.find((t) => t.id === active)!;

  return (
    <div className="mx-auto max-w-5xl px-6 pb-32 pt-32">
      <h1 className="text-3xl font-bold tracking-tight">Scheduler</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Complete the personality assessment to unlock the rest of your workspace.
      </p>

      <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-2">
        {tabs.map((tab) => {
          const disabled = tab.locked && !unlocked;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={disabled}
              aria-disabled={disabled}
              onClick={() => !disabled && setActive(tab.id)}
              className={[
                "relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                disabled
                  ? "cursor-not-allowed text-muted-foreground/40"
                  : isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {disabled ? <Lock className="size-4" /> : <tab.icon className="size-4" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-10"
        >
          {active === "assessment" ? (
            <AssessmentQuiz
              onComplete={() => {
                setAssessmentComplete(true);
                toast.success("Assessment complete — all tabs unlocked.");
              }}
            />
          ) : (
            <>
              <h2 className="text-lg font-medium">{activeTab.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This section is coming next.
              </p>
            </>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
