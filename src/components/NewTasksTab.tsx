import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, Trash2, Pencil, Zap, ChevronDown,
  ChevronUp, RotateCcw,
  BookOpen, User, AlertTriangle,
  Plus, Minus, CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import {
  startOfWeek, addDays, format, isSameDay, startOfToday,
} from "date-fns";
import type { FlowwProfile } from "@/lib/profile";
import {
  loadRoutineBlocks,
  loadSleepBoundaries,
  saveRoutineBlocks,
  loadDemoRoutineBlocks,
  loadActiveRoutine,
  saveDemoRoutineBlocks,
} from "@/lib/routine";
import type {
  Task, AcademicSubType, PersonalSubType,
  EffortLevel, EnergyLevel, DeadlineOption,
  TimingOption, PriorityLevel, PlanCount,
  GenerationResult, GeneratedSchedule,
} from "@/lib/tasks";

// ─── Constants ──────────────────────────────────────────────────────────────

const ACADEMIC_SUBTYPES: AcademicSubType[] = [
  "Assignment", "Study", "Project", "Presentation", "Exam Prep",
];
const PERSONAL_SUBTYPES: PersonalSubType[] = [
  "Social", "Hobby", "Chores", "Exercise", "Wellbeing", "Errand",
];
const EFFORT_LEVELS: EffortLevel[] = ["Light", "Medium", "Heavy"];
const ENERGY_LEVELS: EnergyLevel[] = ["Low", "Medium", "High"];
const DEADLINE_OPTIONS: DeadlineOption[] = [
  "This week", "Next week", "14+ days", "Specific day",
];
const TIMING_OPTIONS: TimingOption[] = [
  "Flexible", "This week", "Specific day",
];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BLOCK_COLORS: Record<string, string> = {
  academic: "#8b5cf6",
  personal: "#f43f5e",
  recovery: "#10b981",
  buffer:   "#f59e0b",
  anchor:   "#374151",
};

function formatHour12(h: number): string {
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

function formatTime12h(time24: string): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr || "0", 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12;
  if (h === 0) h = 12;
  return m === "00" ? `${h}${ampm}` : `${h}:${m}${ampm}`;
}

// ─── Loading Animation ───────────────────────────────────────────────────────

const LOADING_MESSAGES = [
  "Reading your brain profile...",
  "Mapping your peak focus windows...",
  "Making room for your personal life...",
  "Placing your academic blocks...",
  "Balancing your week...",
  "Almost ready...",
];

function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // FIX: was useState(() => {}) — timers never cleaned up. Now useEffect.
  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    const progTimer = setInterval(() => {
      setProgress((p) => (p >= 85 ? 85 : p + 2));
    }, 70);
    return () => {
      clearInterval(msgTimer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 py-16">
      <div className="relative flex items-center justify-center">
        {[60, 80, 100].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border-2 border-primary"
            style={{
              width: size,
              height: size,
              animation: `pulse-ring 1.5s ease-out infinite ${i * 0.4}s`,
            }}
          />
        ))}
        <span className="text-2xl text-primary z-10">✦</span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground animate-pulse">
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      <div className="w-48 h-0.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Schedule Calendar ───────────────────────────────────────────────────────

function ScheduleCalendar({
  schedule,
  planGridId,
}: {
  schedule: GeneratedSchedule;
  planGridId: string;
}) {
  const [tooltip, setTooltip] = useState<{
    text: string; x: number; y: number;
  } | null>(null);

  const activeRoutine = loadActiveRoutine();
  const anchors = activeRoutine === "demo" ? loadDemoRoutineBlocks() : loadRoutineBlocks();
  const weekStart = startOfWeek(startOfToday(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const DAY_MAP: Record<string, number> = {
    Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3,
    Friday: 4, Saturday: 5, Sunday: 6,
  };

  return (
    <div id={planGridId} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex border-b border-border">
        <div className="w-14 shrink-0 border-r border-border" />
        {weekDays.map((date, i) => {
          const isToday = isSameDay(date, startOfToday());
          return (
            <div
              key={i}
              className={`flex flex-1 flex-col items-center py-2 border-r border-border
                ${i === 5 || i === 6 ? "bg-muted/5" : ""}
              `}
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {format(date, "EEE")}
              </span>
              <span className={`text-base font-bold ${isToday ? "text-primary" : "text-foreground"}`}>
                {format(date, "d")}
              </span>
              {isToday && <div className="size-1 rounded-full bg-primary mt-0.5" />}
            </div>
          );
        })}
      </div>

      <div className="relative overflow-y-auto" style={{ height: 480 }}>
        <div className="flex relative" style={{ minHeight: 24 * 48 }}>
          <div className="w-14 shrink-0 border-r border-border bg-card sticky left-0">
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="relative h-12 border-b border-transparent">
                <span className="absolute top-0.5 right-1.5 text-[10px] text-muted-foreground">
                  {formatHour12(h)}
                </span>
              </div>
            ))}
          </div>

          {weekDays.map((_, dayIndex) => {
            const isWeekend = dayIndex === 5 || dayIndex === 6;
            const dayAnchors = anchors.filter((a) => a.days.includes(dayIndex));
            const dayBlocks = schedule.blocks.filter(
              (b) => DAY_MAP[b.day] === dayIndex
            );

            return (
              <div
                key={dayIndex}
                className={`relative flex-1 border-r border-border ${isWeekend ? "bg-muted/5" : ""}`}
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="h-12 border-t border-border/30">
                    <div className="h-1/2 border-b border-dashed border-border/20" />
                  </div>
                ))}

                {dayAnchors.map((anchor) => {
                  const [sh, sm] = anchor.startTime.split(":").map(Number);
                  const [eh, em] = anchor.endTime.split(":").map(Number);
                  const top = (sh! * 48) + ((sm! / 60) * 48);
                  const height = Math.max(
                    ((eh! * 48 + (em! / 60) * 48) - top), 16
                  );
                  return (
                    <div
                      key={anchor.id}
                      className="absolute inset-x-0.5 rounded overflow-hidden z-10"
                      style={{
                        top,
                        height,
                        background: "#37415122",
                        borderLeft: "2px solid #6b7280",
                      }}
                    >
                      <p className="px-1 text-[9px] font-medium text-muted-foreground truncate leading-tight pt-0.5">
                        {anchor.label}
                      </p>
                    </div>
                  );
                })}

                {dayBlocks.map((block, bi) => {
                  const [sh, sm] = block.startTime.split(":").map(Number);
                  const [eh, em] = block.endTime.split(":").map(Number);
                  const top = (sh! * 48) + ((sm! / 60) * 48);
                  const height = Math.max(
                    ((eh! * 48 + (em! / 60) * 48) - top), 18
                  );
                  const color = BLOCK_COLORS[block.type] ?? "#8b5cf6";

                  return (
                    <div
                      key={bi}
                      className="absolute inset-x-0.5 rounded overflow-hidden z-20 cursor-pointer transition-opacity hover:opacity-90"
                      style={{
                        top,
                        height,
                        background: `${color}22`,
                        borderLeft: `3px solid ${color}`,
                        animationDelay: `${bi * 40}ms`,
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          text: block.reason,
                          x: rect.left,
                          y: rect.top - 8,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <div className="px-1 pt-0.5">
                        <p className="text-[9px] font-semibold truncate leading-tight"
                          style={{ color }}>
                          {block.task}
                        </p>
                        <p className="text-[8px] text-muted-foreground">
                          {formatTime12h(block.startTime)}–{formatTime12h(block.endTime)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 max-w-[200px] rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateY(-100%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface NewTasksTabProps {
  profile: FlowwProfile | null;
}

export function NewTasksTab({ profile }: NewTasksTabProps) {
  // Form state
  const [taskType, setTaskType] = useState<"academic" | "personal">("academic");
  const [name, setName] = useState("");
  const [subType, setSubType] = useState<AcademicSubType | PersonalSubType>("Assignment");
  const [course, setCourse] = useState("");
  const [effort, setEffort] = useState<EffortLevel | EnergyLevel>("Medium");
  const [hours, setHours] = useState(2);
  const [canSplit, setCanSplit] = useState(false);
  const [deadline, setDeadline] = useState<DeadlineOption | TimingOption>("This week");
  const [specificDay, setSpecificDay] = useState("Mon");
  const [priority, setPriority] = useState<PriorityLevel>("Normal");

  // Task list
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Generation
  const [planCount, setPlanCount] = useState<PlanCount>(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [activePlan, setActivePlan] = useState(0);

  const planGridId = "pragma-plan-grid";

  // ── Helpers ──────────────────────────────────────────────────────────────

  function resetForm() {
    setName("");
    setSubType("Assignment");
    setCourse("");
    setEffort("Medium");
    setHours(2);
    setCanSplit(false);
    setDeadline("This week");
    setSpecificDay("Mon");
    setPriority("Normal");
    setEditingId(null);
  }

  function handleTypeSwitch(t: "academic" | "personal") {
    setTaskType(t);
    setSubType(t === "academic" ? "Assignment" : "Social");
    setEffort("Medium");
    resetForm();
  }

  function handleAddTask() {
    if (!name.trim()) {
      toast.error("Task name is required.");
      return;
    }
    if (!subType) {
      toast.error("Please select a task type.");
      return;
    }
    if (hours <= 0) {
      toast.error("Duration must be greater than 0.");
      return;
    }

    const taskBase = {
      id: editingId ?? crypto.randomUUID(),
      taskType,
      name: name.trim(),
      subType,
      effort,
      hours,
      deadline,
      priority,
    };
    const task: Task = taskBase;

    if (taskType === "academic") {
      task.course = course;
      task.canSplit = canSplit;
    }
    if (deadline === "Specific day") {
      task.specificDay = specificDay;
    }

    if (editingId) {
      setTasks((prev) => prev.map((t) => (t.id === editingId ? task : t)));
      toast.success("Task updated ✓");
    } else {
      setTasks((prev) => [...prev, task]);
      toast.success("Task added ✓");
    }
    resetForm();
  }

  function handleEditTask(task: Task) {
    setEditingId(task.id);
    setTaskType(task.taskType);
    setName(task.name);
    setSubType(task.subType);
    setCourse(task.course ?? "");
    setEffort(task.effort);
    setHours(task.hours);
    setCanSplit(task.canSplit ?? false);
    setDeadline(task.deadline);
    setSpecificDay(task.specificDay ?? "Mon");
    setPriority(task.priority);
  }

  function handleDeleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task removed");
    if (editingId === id) resetForm();
  }

  // ── Generation ────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (tasks.length === 0) return;

    setIsGenerating(true);
    setResult(null);

    const activeRoutine = loadActiveRoutine();
    const anchors = activeRoutine === "demo" ? loadDemoRoutineBlocks() : loadRoutineBlocks();
    const sleep = loadSleepBoundaries(profile, activeRoutine);

    const prompt = `
You are a neuroscience-backed weekly scheduler for university students.
Generate a personalised weekly schedule.

STUDENT PERSONALITY PROFILE:
Type: ${profile?.type ?? "Unknown"}
Chronotype: ${profile?.traits.chronotype ?? "intermediate"}
Focus Style: ${profile?.traits.focusStyle ?? "flexible"}
Cognitive Load: ${profile?.traits.cognitiveLoad ?? "medium"}
Motivation: ${profile?.traits.motivation ?? "mixed"}
Energy Recovery: ${profile?.traits.energyRecovery ?? "ambivert"}
Procrastination: ${profile?.traits.procrastination ?? "mood"}

SLEEP BOUNDARIES:
Wake Up: ${sleep.wakeTime}
Bed Time: ${sleep.bedTime}
Never schedule anything before wake or after bed time.

FIXED ANCHOR BLOCKS (never schedule over these):
${anchors.length > 0
  ? anchors.map((a) =>
      `${a.label}: ${a.days.map((d) => WEEK_DAYS[d]).join("/")} ${a.startTime}–${a.endTime}`
    ).join("\n")
  : "None"}

TASKS TO SCHEDULE THIS WEEK:
${tasks.map((t, i) => `
${i + 1}. "${t.name}"
   Type: ${t.taskType} (${t.subType})
   ${t.course ? `Course: ${t.course}` : ""}
   Effort: ${t.effort}
   Duration: ${t.hours} hours total
   Split allowed: ${t.canSplit ? "Yes — split into 2 sessions if needed" : "No"}
   Deadline: ${t.deadline}${t.specificDay ? ` (${t.specificDay})` : ""}
   Priority: ${t.priority}
`).join("\n")}

SCHEDULING RULES:
1. Never place blocks during anchor blocks.
2. Never schedule before ${sleep.wakeTime} or after ${sleep.bedTime}.
3. Peak hours by chronotype:
   morning → 08:00–12:00 (peak), 12:00–16:00 (moderate), evening (low)
   evening → 18:00–22:00 (peak), 14:00–17:00 (moderate), morning (low)
   intermediate → 10:00–14:00 (peak), rest moderate
4. Place Heavy and High Priority academic tasks during peak hours.
5. Block sizing by focus style:
   deep → 60–90 min blocks
   sprinter → 25 min blocks with 5 min breaks
   flexible → 45 min blocks
6. Cognitive load limits:
   high → up to 2 heavy tasks per day
   low or medium → max 1 heavy task per day, never consecutive
7. Motivation:
   progress → start tasks as early in week as possible
   deadline → schedule closer to due date with 1-day buffer
   mixed → balanced
8. Procrastination:
   avoidant → always schedule a small first block on Monday or Tuesday
   arousal → cluster blocks 1–2 days before deadline
   mood → spread evenly
9. Energy recovery:
   introvert → add 30-min recovery block after any social anchor
   extrovert → no recovery needed
   ambivert → recovery only after 3+ hour social block
10. Personal tasks go in low-energy time slots.
11. If split is allowed and task is Heavy, divide into 2 sessions.
12. Add a 30-min buffer block the day before any "This week" deadline.
13. Generate exactly ${planCount} schedule option(s).
    If 2: Option A front-loaded (tasks earlier), Option B back-loaded (tasks later).

Return ONLY valid JSON, no other text:
{
  "schedules": [
    {
      "id": 1,
      "label": "Short plan name",
      "approach": "One sentence describing this plan's philosophy",
      "blocks": [
        {
          "day": "Monday",
          "startTime": "09:00",
          "endTime": "10:30",
          "task": "Task name",
          "type": "academic",
          "reason": "Why this slot for this student"
        }
      ]
    }
  ],
  "tips": [
    { "icon": "Brain", "title": "Tip title", "body": "Specific tip for this student" },
    { "icon": "Clock", "title": "Tip title", "body": "Specific tip" },
    { "icon": "Zap",   "title": "Tip title", "body": "Specific tip" }
  ],
  "warnings": []
}`;

    try {
      // ✅ Call our own backend route — no key on the client
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        let detail = `Server error ${res.status}`;
        try {
          const errBody = await res.json();
          detail = errBody?.error?.message || errBody?.error || detail;
        } catch {
          /* ignore */
        }
        throw new Error(detail);
      }

      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) throw new Error("Empty response from Gemini");

      const parsed: GenerationResult = JSON.parse(raw);
      setResult(parsed);
      setActivePlan(0);

      if (parsed.warnings?.length) {
        parsed.warnings.forEach((w) => toast.warning(w));
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Generation failed";
      toast.error(message, {
        action: { label: "Retry", onClick: handleGenerate },
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function handleAddToRoutine() {
    if (!result) return;
    const plan = result.schedules[activePlan];
    if (!plan) return;

    const activeRoutine = loadActiveRoutine();
    const anchors = activeRoutine === "demo" ? loadDemoRoutineBlocks() : loadRoutineBlocks();
    const DAY_MAP: Record<string, number> = {
      Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3,
      Friday: 4, Saturday: 5, Sunday: 6,
    };

    const newBlocks = plan.blocks
      .filter((b) => b.type !== "anchor")
      .map((b) => ({
        id: crypto.randomUUID(),
        label: b.task,
        category: "Other" as const,
        days: [DAY_MAP[b.day] ?? 0],
        startTime: b.startTime,
        endTime: b.endTime,
        color: b.type === "academic" ? "violet" :
               b.type === "personal" ? "coral" :
               b.type === "recovery" ? "mint" : "amber",
        oneTime: true,
      }));

    // FIX: was require("@/lib/routine") — crashes in browser. Now top-level import.
    if (activeRoutine === "demo") saveDemoRoutineBlocks([...anchors, ...newBlocks]);
    else saveRoutineBlocks([...anchors, ...newBlocks]);
    toast.success("Added to your routine ✓");
  }

  // ── Free hours calculation ─────────────────────────────────────────────────

  const sleep = loadSleepBoundaries(profile, loadActiveRoutine());
  const [wh, wm] = sleep.wakeTime.split(":").map(Number);
  const [bh, bm] = sleep.bedTime.split(":").map(Number);
  const dailyFreeHours = (bh! + bm! / 60) - (wh! + wm! / 60);
  const weeklyFreeHours = Math.round(dailyFreeHours * 7);
  const totalTaskHours = tasks.reduce((sum, t) => sum + t.hours, 0);
  const overloaded = totalTaskHours > weeklyFreeHours;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-6 min-h-[75vh]">

      {/* LEFT PANEL: Form */}
      <div className="w-[320px] shrink-0 flex flex-col gap-4">

        <div className="flex rounded-xl border border-border overflow-hidden">
          {(["academic", "personal"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTypeSwitch(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                ${taskType === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
                }`}
            >
              {t === "academic"
                ? <BookOpen className="size-4" />
                : <User className="size-4" />}
              {t === "academic" ? "Academic" : "Personal"}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {editingId ? "Edit Task" : "Add Task"}
          </h3>

          <input
            type="text"
            placeholder={
              taskType === "academic"
                ? "e.g. Write essay introduction"
                : "e.g. Call family"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <div className="flex flex-wrap gap-1">
            {(taskType === "academic" ? ACADEMIC_SUBTYPES : PERSONAL_SUBTYPES).map((s) => (
              <button
                key={s}
                onClick={() => setSubType(s as AcademicSubType & PersonalSubType)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors
                  ${subType === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {taskType === "academic" && (
            <input
              type="text"
              placeholder="Course / Subject (e.g. MKTG 301)"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}

          <div>
            <p className="text-[11px] text-muted-foreground mb-1">
              {taskType === "academic" ? "Effort Level" : "Energy Required"}
            </p>
            <div className="flex gap-1">
              {(taskType === "academic" ? EFFORT_LEVELS : ENERGY_LEVELS).map((e) => (
                <button
                  key={e}
                  onClick={() => setEffort(e as EffortLevel & EnergyLevel)}
                  className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors
                    ${effort === e
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground mb-1">Estimated Duration</p>
            <div className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-1.5">
              <button
                onClick={() => setHours((h) => Math.max(0.5, parseFloat((h - 0.5).toFixed(1))))}
                className="text-muted-foreground hover:text-foreground"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="flex-1 text-center text-sm font-medium">{hours} hrs</span>
              <button
                onClick={() => setHours((h) => Math.min(20, parseFloat((h + 0.5).toFixed(1))))}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          {taskType === "academic" && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Split across days?</p>
                <p className="text-[10px] text-muted-foreground">Divide into 2 sessions</p>
              </div>
              <button
                type="button"
                aria-pressed={canSplit}
                onClick={() => setCanSplit((v) => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors
                  ${canSplit ? "bg-primary" : "bg-border"}`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform
                    ${canSplit ? "translate-x-4" : "translate-x-0"}`}
                />
              </button>
            </div>
          )}

          <div>
            <p className="text-[11px] text-muted-foreground mb-1">
              {taskType === "academic" ? "Deadline" : "Timing"}
            </p>
            <div className="flex flex-wrap gap-1">
              {(taskType === "academic" ? DEADLINE_OPTIONS : TIMING_OPTIONS).map((d) => (
                <button
                  key={d}
                  onClick={() => setDeadline(d as DeadlineOption & TimingOption)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors
                    ${deadline === d
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
            {deadline === "Specific day" && (
              <div className="flex gap-1 mt-2">
                {WEEK_DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSpecificDay(d)}
                    className={`flex-1 rounded text-[10px] py-1 font-medium transition-colors
                      ${specificDay === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                  >
                    {d[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {(["Normal", "High Priority"] as PriorityLevel[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors
                  ${priority === p
                    ? p === "High Priority"
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground"
                  }`}
              >
                {p === "High Priority" ? " High Priority" : "— Normal"}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddTask}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {editingId ? "Save Changes" : "+ Add Task"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs text-muted-foreground hover:text-foreground text-center"
            >
              × Cancel edit
            </button>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              This Week's Tasks
              {tasks.length > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                  {tasks.length}
                </span>
              )}
            </h3>
            {tasks.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Clear all tasks?")) {
                    setTasks([]);
                    setResult(null);
                    resetForm();
                  }
                }}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <ClipboardList className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No tasks added yet</p>
              <p className="text-xs text-muted-foreground/60">
                Add your first task to get started
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-lg border p-3 transition-colors
                    ${editingId === task.id
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:border-primary/25"
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-medium truncate">{task.name}</span>
                        {task.priority === "High Priority" && (
                          <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 rounded-full px-1.5 py-0.5">
                             Priority
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-medium
                          ${task.taskType === "academic"
                            ? "bg-primary/10 text-primary"
                            : "bg-rose-500/10 text-rose-400"
                          }`}>
                          {task.subType}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {task.effort} · {task.hours}h
                        </span>
                        {task.course && (
                          <span className="text-[10px] text-muted-foreground">
                            · {task.course}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          · {task.deadline}
                          {task.specificDay ? ` (${task.specificDay})` : ""}
                        </span>
                        {task.canSplit && (
                          <span className="text-[10px] text-muted-foreground">
                            · Can split ✓
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
              <span>Total: {totalTaskHours}h of tasks</span>
              <span>~{weeklyFreeHours}h free this week</span>
            </div>
          )}

          {overloaded && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-400">
              <AlertTriangle className="size-3.5 shrink-0" />
              Your tasks may exceed your available free time this week
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Generate
            </span>
            {([2, 1] as PlanCount[]).map((n) => (
              <label key={n} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  checked={planCount === n}
                  onChange={() => setPlanCount(n)}
                  className="accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  {n === 2 ? "2 plan options (recommended)" : "1 plan only"}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={tasks.length === 0 || isGenerating}
            title={tasks.length === 0 ? "Add at least one task first" : ""}
            className={`w-full rounded-xl py-3.5 text-base font-semibold transition-all
              ${tasks.length === 0 || isGenerating
                ? "opacity-50 cursor-not-allowed bg-primary/60 text-primary-foreground"
                : "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
              }`}
          >
            ✦ Generate My Weekly Plan
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            ✦ Powered by Gemini 3.6 Flash
          </p>
        </div>

        <AnimatePresence>
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-border bg-card"
              style={{ minHeight: 320 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {result && !isGenerating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {result.schedules.length > 1 && (
                <div className="flex gap-2">
                  {result.schedules.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActivePlan(i)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors
                        ${activePlan === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              {result.schedules[activePlan]?.approach && (
                <p className="text-xs italic text-muted-foreground -mt-2">
                  {result.schedules[activePlan]!.approach}
                </p>
              )}

              {result.schedules[activePlan] && (
                <ScheduleCalendar
                  schedule={result.schedules[activePlan]!}
                  planGridId={planGridId}
                />
              )}

              {result.tips?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    Your Personalised Tips
                    <span className="text-primary">✦</span>
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {result.tips.map((tip, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
                      >
                        <Zap className="size-4 text-primary" />
                        <p className="text-sm font-semibold">{tip.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {tip.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap border-t border-border pt-3">
                <button
                  onClick={handleAddToRoutine}
                  title="Sync this plan to the selected routine"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <CalendarDays className="size-3.5" />
                  Add to Routine
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  Regenerate
                </button>
                <button
                  onClick={() => {
                    if (confirm("Clear all tasks and the generated plan?")) {
                      setTasks([]);
                      setResult(null);
                      resetForm();
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="size-3.5" />
                  Clear Tasks
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}