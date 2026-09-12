export const ASSESSMENT_KEY = "neuroflow_assessment_complete";

export function isAssessmentComplete(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ASSESSMENT_KEY) === "true";
}

export function setAssessmentComplete(value: boolean) {
  window.localStorage.setItem(ASSESSMENT_KEY, value ? "true" : "false");
  window.dispatchEvent(new Event("neuroflow:assessment-changed"));
}
