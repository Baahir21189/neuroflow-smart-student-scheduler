import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Brain } from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    title: "Chronotype",
    text: "On a free day with no alarm, when do you naturally feel most mentally sharp?",
    options: [
      { letter: "A", text: "Before noon is my prime time for mental clarity." },
      { letter: "B", text: "After 6 PM is when I tend to hit my stride later in the day." },
      { letter: "C", text: "Midday works best because I take a while to warm up and peak around noon." },
    ],
  },
  {
    id: "q2",
    title: "Focus Style",
    text: "When you sit down to study, how does your focus typically work?",
    options: [
      { letter: "A", text: "I am a deep diver — I easily settle into long, 60 to 90-minute flow states." },
      { letter: "B", text: "I am a sprint worker — I do best in 25 to 30-minute blocks before needing a reset." },
      { letter: "C", text: "My focus is flexible and depends entirely on the subject and my current energy." },
    ],
  },
  {
    id: "q3",
    title: "Cognitive Load Tolerance",
    text: "You have three heavy assignments due this week. Your initial reaction is:",
    options: [
      { letter: "A", text: "To tackle them head-on because I can stack multiple hard tasks in a single day." },
      { letter: "B", text: "To spread them out since too much at once tends to overwhelm me." },
      { letter: "C", text: "To push through because it is difficult but manageable by taking structured breaks." },
    ],
  },
  {
    id: "q4",
    title: "Motivation Style",
    text: "When do you produce your best work?",
    options: [
      { letter: "A", text: "Right against the deadline — the pressure unlocks focus for me." },
      { letter: "B", text: "When I start early — unstarted tasks hang over my head and stress me out." },
      { letter: "C", text: "Somewhere in between — it really depends on the stakes." },
    ],
  },
  {
    id: "q5",
    title: "Energy Recovery",
    text: "After a full day of classes and people, what do you need the most?",
    options: [
      { letter: "A", text: "Quiet solo time — social energy drains me and I need to recharge alone." },
      { letter: "B", text: "Social time — being around people actually helps me decompress." },
      { letter: "C", text: "A mix of both depending on how the day went." },
    ],
  },
  {
    id: "q6",
    title: "Procrastination Type",
    text: "When you keep delaying a task, what is the real reason behind it?",
    options: [
      { letter: "A", text: "I am waiting for the adrenaline of a closer deadline to kick in." },
      { letter: "B", text: "It feels overwhelming and I am simply not sure where to start." },
      { letter: "C", text: "I am waiting for the right mood or a sudden burst of motivation to hit." },
    ],
  },
] as const;

type Answers = Record<string, "A" | "B" | "C">;

const cardVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export function AssessmentQuiz() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const question = QUESTIONS[current];
  const selected = answers[question.id];
  const isLast = current === QUESTIONS.length - 1;

  function selectOption(letter: "A" | "B" | "C") {
    setAnswers((prev) => ({ ...prev, [question.id]: letter }));
  }

  function calculateResult(finalAnswers: Answers) {
    // Placeholder — result logic defined in a later prompt.
    console.log("Assessment answers:", finalAnswers);
  }

  function handleNext() {
    if (!selected) return;
    if (isLast) {
      calculateResult(answers);
      return;
    }
    setCurrent((c) => c + 1);
  }

  function handleBack() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center py-16 text-center"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15">
          <Brain className="size-8 text-primary" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">
          Discover how your brain works
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Six quick questions about your focus, energy, and motivation — so
          NeuroFlow can build a routine around how you actually think.
        </p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Begin Your Assessment
          <ArrowRight className="size-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="py-4">
      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={current === 0}
          className={[
            "inline-flex items-center gap-1.5 text-sm transition-colors",
            current === 0
              ? "invisible"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          Question {current + 1} of {QUESTIONS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-6"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            {question.title}
          </p>
          <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
            {question.text}
          </h3>

          <div className="mt-8 flex flex-col gap-3">
            {question.options.map((option) => {
              const isSelected = selected === option.letter;
              return (
                <button
                  key={option.letter}
                  type="button"
                  onClick={() => selectOption(option.letter)}
                  className={[
                    "flex items-start gap-4 rounded-xl border p-4 text-left transition-colors",
                    isSelected
                      ? "border-primary/60 bg-primary/10"
                      : "border-border bg-secondary/40 hover:border-primary/30 hover:bg-secondary",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground",
                    ].join(" ")}
                  >
                    {option.letter}
                  </span>
                  <span
                    className={[
                      "text-sm leading-relaxed",
                      isSelected ? "text-foreground" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex min-h-12 justify-end">
            <AnimatePresence>
              {selected && (
                <motion.button
                  key="next"
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {isLast ? "See My Results" : "Next"}
                  <ArrowRight className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
