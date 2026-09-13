export type AnswerLetter = "A" | "B" | "C";

export type AssessmentAnswers = Record<
  "q1" | "q2" | "q3" | "q4" | "q5" | "q6",
  AnswerLetter
>;

export type PersonalityTypeName =
  | "Morning Architect"
  | "Burst Architect"
  | "Night Builder"
  | "Steady Drifter";

export interface FlowwProfile {
  type: PersonalityTypeName;
  answers: AssessmentAnswers;
  traits: {
    chronotype: "morning" | "evening" | "intermediate";
    focusStyle: "deep" | "sprinter" | "flexible";
    cognitiveLoad: "high" | "low" | "medium";
    motivation: "deadline" | "progress" | "mixed";
    energyRecovery: "introvert" | "extrovert" | "ambivert";
    procrastination: "arousal" | "avoidant" | "mood";
  };
}

export interface TypeContent {
  name: PersonalityTypeName;
  tagline: string;
  howYouThink: string;
  academics: string[];
  personal: string[];
  week: {
    wake: string;
    bed: string;
    peak: string;
    personal: string;
  };
}

export const PROFILE_KEY = "floww_profile";
export const COMPLETE_KEY = "floww_assessment_complete";

export const TYPE_CONTENT: Record<PersonalityTypeName, TypeContent> = {
  "Morning Architect": {
    name: "Morning Architect",
    tagline: "You do your sharpest thinking before the world gets loud.",
    howYouThink:
      "Your brain reaches peak cognitive performance in the morning, which means your most demanding work belongs before noon — not after. You thrive when you start tasks early, build momentum through the day, and treat your evenings as earned rest rather than borrowed study time. Unstructured weeks frustrate you because you naturally want a clear plan to execute against.",
    academics: [
      "Schedule your hardest tasks between 8am and 12pm — this is your biological prime time, protect it.",
      "Start assignments at least 3 days before the deadline to use your peak hours rather than cramming at night.",
      "Use 60 to 90-minute deep work blocks in the morning, then switch to lighter review tasks in the afternoon.",
    ],
    personal: [
      "Keep your evenings free by default — you've earned them and your brain needs the recovery.",
      "Schedule social plans, hobbies, and errands in the afternoon when your cognitive load naturally dips.",
      "Protect at least one full morning per week with nothing scheduled — use it to reset and recharge.",
    ],
    week: {
      wake: "6:30am – 7:00am",
      bed: "10:30pm – 11:00pm",
      peak: "8:00am – 12:00pm",
      personal: "Afternoons and evenings",
    },
  },
  "Burst Architect": {
    name: "Burst Architect",
    tagline: "You work fast, focus hard, and finish strong under pressure.",
    howYouThink:
      "You're a morning person who works best in short, intense bursts rather than long sessions — and you genuinely perform better when a deadline is close enough to feel real. This combination means you can get an impressive amount done in a short morning window, but you need that window to be distraction-free and time-boxed. Vague open-ended study sessions don't work for you — structured sprints with clear endpoints do.",
    academics: [
      "Use the Pomodoro method in the morning: 25-minute sprints with 5-minute breaks, four rounds maximum before a longer rest.",
      "Schedule your sprint blocks between 8am and 12pm while your energy and pressure-response are both high.",
      "Break every assignment into small, timed sub-tasks — this creates the micro-deadlines your brain responds best to.",
    ],
    personal: [
      "Your afternoons are naturally lower energy — use them for personal errands, social time, and hobbies.",
      "Avoid letting personal tasks bleed into your morning sprint window, even on low-deadline weeks.",
      "Build in proper rest after your sprint sessions — short intense focus is cognitively expensive.",
    ],
    week: {
      wake: "7:00am – 7:30am",
      bed: "11:00pm – 11:30pm",
      peak: "8:00am – 12:00pm",
      personal: "Afternoons and evenings",
    },
  },
  "Night Builder": {
    name: "Night Builder",
    tagline: "Your best work happens when most people are already asleep.",
    howYouThink:
      "Your cognitive peak arrives in the evening, which means forcing yourself to do serious mental work before noon is actively working against your biology. You're wired for deep, sustained concentration once the day quiets down. Deadlines create a productive kind of pressure for you — and that's not a flaw, it's how your motivation system is built. The key is using your mornings intentionally for lighter tasks rather than wasting your energy fighting your own chronotype.",
    academics: [
      "Block your evenings from 7pm to 11pm as non-negotiable study time — this is when your brain is at full power.",
      "Use deadlines as your natural starting signal, but give yourself a 2-day buffer so you're not finishing at 3am the night before submission.",
      "Avoid scheduling important cognitive work before noon — use mornings for admin, readings, and light tasks only.",
    ],
    personal: [
      "Treat your mornings as personal time by default — gym, meals, hobbies, and social catch-ups belong here.",
      "Don't schedule social events in the evening during heavy academic weeks — your peak window is too valuable to give up.",
      "Build in a wind-down routine after 11pm so late nights don't bleed into sleep deprivation.",
    ],
    week: {
      wake: "8:30am – 9:30am",
      bed: "12:00am – 1:00am",
      peak: "7:00pm – 11:00pm",
      personal: "Mornings and early afternoons",
    },
  },
  "Steady Drifter": {
    name: "Steady Drifter",
    tagline: "You work best when your week has shape without rigidity.",
    howYouThink:
      "Your cognitive peak arrives mid-morning and holds steadily through early afternoon — you are not an extreme morning or evening type, which actually gives you one of the most workable natural schedules. This flexibility is a genuine advantage, but it also means you are more vulnerable to drifting without a clear plan. A well-designed weekly structure is less about optimising peak hours and more about creating the consistency that lets you do steady, reliable work across the whole week.",
    academics: [
      "Schedule study blocks in the mid-morning window from 10am to 2pm where your focus is most reliable.",
      "Consistency matters more than intensity for you — daily study habits outperform irregular heavy sessions.",
      "Build a repeating weekly structure and protect it — your performance improves when your schedule is predictable.",
    ],
    personal: [
      "Use your early mornings and evenings for personal time — they naturally sit outside your most productive academic window.",
      "Avoid completely unstructured days — even on weekends, light anchors help you stay grounded.",
      "Your social energy is fairly balanced, so you can schedule social time more freely than other types without it draining your focus.",
    ],
    week: {
      wake: "7:30am – 8:00am",
      bed: "11:00pm – 12:00am",
      peak: "10:00am – 2:00pm",
      personal: "Early mornings and evenings",
    },
  },
};

export function calculateProfile(answers: AssessmentAnswers): FlowwProfile {
  const chronotype =
    answers.q1 === "A"
      ? ("morning" as const)
      : answers.q1 === "B"
        ? ("evening" as const)
        : ("intermediate" as const);
  const focusStyle =
    answers.q2 === "A"
      ? ("deep" as const)
      : answers.q2 === "B"
        ? ("sprinter" as const)
        : ("flexible" as const);

  let type: PersonalityTypeName;
  if (chronotype === "intermediate") {
    type = "Steady Drifter";
  } else if (chronotype === "morning") {
    type = focusStyle === "sprinter" ? "Burst Architect" : "Morning Architect";
  } else {
    type = "Night Builder";
  }

  return {
    type,
    answers,
    traits: {
      chronotype,
      focusStyle,
      cognitiveLoad:
        answers.q3 === "A" ? "high" : answers.q3 === "B" ? "low" : "medium",
      motivation:
        answers.q4 === "A"
          ? "deadline"
          : answers.q4 === "B"
            ? "progress"
            : "mixed",
      energyRecovery:
        answers.q5 === "A"
          ? "introvert"
          : answers.q5 === "B"
            ? "extrovert"
            : "ambivert",
      procrastination:
        answers.q6 === "A"
          ? "arousal"
          : answers.q6 === "B"
            ? "avoidant"
            : "mood",
    },
  };
}

export function academicsBullets(profile: FlowwProfile): string[] {
  const bullets = [...TYPE_CONTENT[profile.type].academics];
  if (profile.answers.q3 === "B") {
    bullets.push(
      "Never stack more than one heavy task per day — your brain performs better with breathing room between demands.",
    );
  }
  if (profile.answers.q6 === "B") {
    bullets.push(
      "Break every large task into a small first step and schedule that step at the start of the week — the barrier for you is starting, not continuing.",
    );
  }
  return bullets;
}

export function personalBullets(profile: FlowwProfile): string[] {
  const bullets = [...TYPE_CONTENT[profile.type].personal];
  if (profile.answers.q5 === "A") {
    bullets.push(
      "Schedule a recovery block after any social commitment or back-to-back class day — this is biological, not optional.",
    );
  }
  return bullets;
}

export function traitPills(profile: FlowwProfile): string[] {
  const { q1, q2, q4 } = profile.answers;
  const chrono =
    q1 === "A" ? "Morning Peak" : q1 === "B" ? "Evening Peak" : "Midday Peak";
  const focus =
    q2 === "A" ? "Deep Focus" : q2 === "B" ? "Sprint Focus" : "Flexible Focus";
  const motivation =
    q4 === "A"
      ? "Deadline-Driven"
      : q4 === "B"
        ? "Progress-Driven"
        : "Balanced Drive";
  return [chrono, focus, motivation];
}

export function saveProfile(profile: FlowwProfile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.localStorage.setItem(COMPLETE_KEY, "true");
  window.dispatchEvent(new Event("neuroflow:assessment-changed"));
}

export function loadProfile(): FlowwProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as FlowwProfile) : null;
  } catch {
    return null;
  }
}

export function clearAllData() {
  window.localStorage.clear();
  window.dispatchEvent(new Event("neuroflow:assessment-changed"));
}
