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
export const PRAGMA_SLEEP_KEY = "pragma_sleep";

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

export function loadSleepBoundaries(profile: FlowwProfile | null): SleepBoundaries {
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
