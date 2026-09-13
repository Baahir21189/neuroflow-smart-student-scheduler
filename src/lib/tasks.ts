export type TaskType = "academic" | "personal";

export type AcademicSubType =
  | "Assignment"
  | "Study"
  | "Project"
  | "Presentation"
  | "Exam Prep";

export type PersonalSubType =
  | "Social"
  | "Hobby"
  | "Chores"
  | "Exercise"
  | "Wellbeing"
  | "Errand";

export type EffortLevel = "Light" | "Medium" | "Heavy";
export type EnergyLevel = "Low" | "Medium" | "High";
export type DeadlineOption =
  | "This week"
  | "Next week"
  | "14+ days"
  | "Specific day";
export type TimingOption = "Flexible" | "This week" | "Specific day";
export type PriorityLevel = "Normal" | "High Priority";
export type PlanCount = 1 | 2;

export interface Task {
  id: string;
  taskType: TaskType;
  name: string;
  subType: AcademicSubType | PersonalSubType;
  course?: string;
  effort: EffortLevel | EnergyLevel;
  hours: number;
  canSplit?: boolean;
  deadline: DeadlineOption | TimingOption;
  specificDay?: string;
  priority: PriorityLevel;
}

export interface GeneratedBlock {
  day: string;
  startTime: string;
  endTime: string;
  task: string;
  type: "academic" | "personal" | "recovery" | "buffer" | "anchor";
  reason: string;
}

export interface GeneratedTip {
  icon: string;
  title: string;
  body: string;
}

export interface GeneratedSchedule {
  id: number;
  label: string;
  approach: string;
  blocks: GeneratedBlock[];
}

export interface GenerationResult {
  schedules: GeneratedSchedule[];
  tips: GeneratedTip[];
  warnings: string[];
}