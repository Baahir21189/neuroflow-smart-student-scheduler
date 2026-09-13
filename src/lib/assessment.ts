import { COMPLETE_KEY } from "@/lib/profile";

export const ASSESSMENT_KEY = COMPLETE_KEY;

export function isAssessmentComplete(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ASSESSMENT_KEY) === "true";
}

export function setAssessmentComplete(value: boolean) {
  window.localStorage.setItem(ASSESSMENT_KEY, value ? "true" : "false");
  window.dispatchEvent(new Event("neuroflow:assessment-changed"));
}
