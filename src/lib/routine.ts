import { FlowwProfile } from "./profile";

export interface RoutineBlock {
  id: string;
  label: string;
  category: "Class" | "Gym" | "Meal" | "Commute" | "Other";
  days: number[]; // 0 for Mon, 1 for Tue, ..., 6 for Sun
  startTime: string; // HH:mm (24h format)
  endTime: string; // HH:mm
  color: string;
}

export interface SleepBoundaries {
  wakeTime: string; // HH:mm
  bedTime: string; // HH:mm
}

export const PRAGMA_ANCHORS_KEY = "pragma_anchors";
export const PRAGMA_DEMO_ANCHORS_KEY = "pragma_demo_anchors";
export const PRAGMA_ACTIVE_ROUTINE_KEY = "pragma_active_routine";
export const PRAGMA_SLEEP_KEY = "pragma_sleep";

export type RoutineKind = "personal" | "demo";

export const DEFAULT_DEMO_ROUTINE: RoutineBlock[] = [
  {
    id: "demo-prayer-morning",
    label: "Prayer Time",
    category: "Other",
    days: [0, 1, 2, 3, 4, 5, 6],
    startTime: "05:00",
    endTime: "05:30",
    color: "violet",
  },
  {
    id: "demo-commute",
    label: "Commute Bus",
    category: "Commute",
    days: [0, 1, 2, 3, 4],
    startTime: "06:00",
    endTime: "08:00",
    color: "mint",
  },
  {
    id: "demo-university",
    label: "University",
    category: "Class",
    days: [0, 1, 2, 3],
    startTime: "09:00",
    endTime: "15:00",
    color: "blue",
  },
  {
    id: "demo-university-friday",
    label: "University",
    category: "Class",
    days: [4],
    startTime: "09:00",
    endTime: "12:00",
    color: "blue",
  },
  {
    id: "demo-prayer-friday",
    label: "Friday Prayer",
    category: "Other",
    days: [4],
    startTime: "12:30",
    endTime: "13:30",
    color: "coral",
  },
];

export function loadActiveRoutine(): RoutineKind {
  if (typeof window === "undefined") return "personal";
  return window.localStorage.getItem(PRAGMA_ACTIVE_ROUTINE_KEY) === "demo"
    ? "demo"
    : "personal";
}

export function saveActiveRoutine(routine: RoutineKind) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRAGMA_ACTIVE_ROUTINE_KEY, routine);
  window.dispatchEvent(new Event("neuroflow:routine-selection-changed"));
}

export function loadRoutineBlocks(): RoutineBlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PRAGMA_ANCHORS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRoutineBlocks(blocks: RoutineBlock[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRAGMA_ANCHORS_KEY, JSON.stringify(blocks));
  window.dispatchEvent(new Event("neuroflow:routine-changed"));
}

export function loadDemoRoutineBlocks(): RoutineBlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PRAGMA_DEMO_ANCHORS_KEY);
    if (raw !== null) return JSON.parse(raw) as RoutineBlock[];

    const defaults = DEFAULT_DEMO_ROUTINE.map((block) => ({
      ...block,
      days: [...block.days],
    }));
    window.localStorage.setItem(PRAGMA_DEMO_ANCHORS_KEY, JSON.stringify(defaults));
    return defaults;
  } catch {
    return [];
  }
}

export function saveDemoRoutineBlocks(blocks: RoutineBlock[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRAGMA_DEMO_ANCHORS_KEY, JSON.stringify(blocks));
  window.dispatchEvent(new Event("neuroflow:routine-changed"));
}

export function loadSleepBoundaries(profile: FlowwProfile | null, routine: RoutineKind = "personal"): SleepBoundaries {
  if (routine === "demo") {
    return { wakeTime: "05:00", bedTime: "22:00" };
  }

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(PRAGMA_SLEEP_KEY);
      if (raw) return JSON.parse(raw) as SleepBoundaries;
    } catch {}
  }
  
  // Default values based on profile
  let wakeTime = "08:00";
  if (profile) {
    if (profile.type === "Morning Architect") wakeTime = "06:30";
    else if (profile.type === "Burst Architect") wakeTime = "07:00";
    else if (profile.type === "Steady Drifter") wakeTime = "07:30";
    else if (profile.type === "Night Builder") wakeTime = "08:30";
  }
  return { wakeTime, bedTime: "23:00" };
}

export function saveSleepBoundaries(bounds: SleepBoundaries) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRAGMA_SLEEP_KEY, JSON.stringify(bounds));
  window.dispatchEvent(new Event("neuroflow:routine-changed"));
}

export function clearRoutineData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PRAGMA_ANCHORS_KEY);
  window.dispatchEvent(new Event("neuroflow:routine-changed"));
}

export function clearDemoRoutineData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PRAGMA_DEMO_ANCHORS_KEY);
  window.dispatchEvent(new Event("neuroflow:routine-changed"));
}
