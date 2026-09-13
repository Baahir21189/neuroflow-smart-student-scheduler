import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Sunrise, Moon, ChevronLeft, ChevronRight, Plus, Maximize2, Minimize2,
  Pencil, Trash2, CheckCircle2, AlertCircle 
} from "lucide-react";
import { 
  startOfWeek, addDays, subWeeks, addWeeks, 
  format, isSameDay, startOfToday 
} from "date-fns";
import { toast } from "sonner";
import { 
  RoutineBlock, SleepBoundaries, 
  loadRoutineBlocks, saveRoutineBlocks, 
  loadDemoRoutineBlocks, saveDemoRoutineBlocks,
  loadSleepBoundaries, saveSleepBoundaries, clearRoutineData, clearDemoRoutineData,
  loadActiveRoutine, saveActiveRoutine, type RoutineKind
} from "@/lib/routine";
import { FlowwProfile } from "@/lib/profile";

interface WeeklyRoutineTabProps {
  profile: FlowwProfile | null;
  onContinueToTasks: () => void;
}

const CATEGORIES = ["Class", "Gym", "Meal", "Commute", "Other"] as const;
const COLORS = [
  { id: "violet", hex: "#8b5cf6" },
  { id: "coral", hex: "#f43f5e" },
  { id: "amber", hex: "#f59e0b" },
  { id: "mint", hex: "#10b981" },
  { id: "blue", hex: "#3b82f6" },
  { id: "rose", hex: "#e11d48" }
];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

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

function formatHour12(h: number): string {
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

export function WeeklyRoutineTab({ profile, onContinueToTasks }: WeeklyRoutineTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(startOfToday(), { weekStartsOn: 1 })
  );
  
  const [blocks, setBlocks] = useState<RoutineBlock[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<RoutineKind>(() => loadActiveRoutine());
  const [sleepBounds, setSleepBounds] = useState<SleepBoundaries>({ wakeTime: "08:00", bedTime: "23:00" });
  const [isExpanded, setIsExpanded] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formCategory, setFormCategory] = useState<RoutineBlock["category"]>("Class");
  const [formDays, setFormDays] = useState<number[]>([]);
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formEndTime, setFormEndTime] = useState("10:00");
  const [formColor, setFormColor] = useState("violet");
  
  useEffect(() => {
    setBlocks(activeRoutine === "demo" ? loadDemoRoutineBlocks() : loadRoutineBlocks());
    setSleepBounds(loadSleepBoundaries(profile, activeRoutine));
    
    // Auto-scroll to 07:00
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 7 * 64; 
    }
    
    const handleStorage = () => {
      setBlocks(activeRoutine === "demo" ? loadDemoRoutineBlocks() : loadRoutineBlocks());
      setSleepBounds(loadSleepBoundaries(profile, activeRoutine));
    };
    window.addEventListener("neuroflow:routine-changed", handleStorage);
    return () => window.removeEventListener("neuroflow:routine-changed", handleStorage);
  }, [profile, activeRoutine]);

  const selectRoutine = (routine: "personal" | "demo") => {
    setActiveRoutine(routine);
    saveActiveRoutine(routine);
    setBlocks(routine === "demo" ? loadDemoRoutineBlocks() : loadRoutineBlocks());
    handleCancelForm();
  };

  const saveActiveBlocks = (nextBlocks: RoutineBlock[]) => {
    if (activeRoutine === "demo") saveDemoRoutineBlocks(nextBlocks);
    else saveRoutineBlocks(nextBlocks);
  };
  
  const handleSaveBlock = () => {
    if (!formLabel.trim() || formDays.length === 0 || !formStartTime || !formEndTime) {
      toast.error("Please fill in all fields (label, days, and times).");
      return;
    }
    
    if (formEndTime <= formStartTime) {
      toast.error("End time must be after start time.");
      return;
    }
    
    const newBlock: RoutineBlock = {
      id: editingId || crypto.randomUUID(),
      label: formLabel,
      category: formCategory,
      days: formDays,
      startTime: formStartTime,
      endTime: formEndTime,
      color: formColor
    };
    
    const newBlocks = editingId 
      ? blocks.map(b => b.id === editingId ? newBlock : b)
      : [...blocks, newBlock];
      
    setBlocks(newBlocks);
    saveActiveBlocks(newBlocks);
    toast.success(`Routine block ${editingId ? "updated" : "saved"} ✓`);
    handleCancelForm();
  };
  
  const handleEdit = (b: RoutineBlock) => {
    setEditingId(b.id);
    setFormLabel(b.label);
    setFormCategory(b.category);
    setFormDays([...b.days]);
    setFormStartTime(b.startTime);
    setFormEndTime(b.endTime);
    setFormColor(b.color);
  };
  
  const handleDelete = (id: string) => {
    const updated = blocks.filter(b => b.id !== id);
    setBlocks(updated);
    saveActiveBlocks(updated);
    toast.success("Routine block deleted");
    if (editingId === id) handleCancelForm();
  };
  
  const handleCancelForm = () => {
    setEditingId(null);
    setFormLabel("");
    setFormCategory("Class");
    setFormDays([]);
    setFormStartTime("09:00");
    setFormEndTime("10:00");
    setFormColor("violet");
  };
  
  const handleResetAll = () => {
    if (confirm("Are you sure you want to clear all routine blocks?")) {
      if (activeRoutine === "demo") clearDemoRoutineData();
      else clearRoutineData();
      setBlocks([]);
    }
  };
  
  const handleGridClick = (dayIndex: number, hour: number) => {
    handleCancelForm();
    setFormDays([dayIndex]);
    setFormStartTime(`${hour.toString().padStart(2, "0")}:00`);
    setFormEndTime(`${(hour + 1).toString().padStart(2, "0")}:00`);
    toast("Adding block for " + DAYS[dayIndex] + ", " + formatHour12(hour));
  };

  const handleSleepChange = (type: "wakeTime" | "bedTime", val: string) => {
    const next = { ...sleepBounds, [type]: val };
    setSleepBounds(next);
    saveSleepBoundaries(next);
  };
  
  // Date calculations
  const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i)), [currentWeekStart]);
  
  const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const goToToday = () => setCurrentWeekStart(startOfWeek(startOfToday(), { weekStartsOn: 1 }));

  return (
    <div className={`${isExpanded ? "fixed inset-0 z-50 h-screen rounded-none" : "min-h-[680px] h-[85vh] rounded-2xl"} flex w-full overflow-hidden border border-border bg-card`}>
      {/* LEFT PANEL */}
      <div className="flex w-[340px] shrink-0 flex-col border-r border-border bg-muted/10">
        
        {/* Section 1: Sleep Boundaries */}
        <div className="border-b border-border p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sleep Boundaries</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Sunrise className="size-4 text-violet-500" />
                Wake Up
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  value={sleepBounds.wakeTime} 
                  onChange={e => handleSleepChange("wakeTime", e.target.value)}
                  className="appearance-none rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {formatTime12h(sleepBounds.wakeTime)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Moon className="size-4 text-rose-500" />
                Bed Time
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  value={sleepBounds.bedTime} 
                  onChange={e => handleSleepChange("bedTime", e.target.value)}
                  className="appearance-none rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {formatTime12h(sleepBounds.bedTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 2: Form */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {editingId ? "Edit Block" : "Add Routine Block"}
            </h3>
            {formDays.length > 0 && !editingId && (
              <button onClick={handleCancelForm} className="text-xs text-muted-foreground hover:text-foreground">
                × Cancel
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="e.g. MKTG 301 Lecture" 
              value={formLabel}
              onChange={e => setFormLabel(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFormCategory(cat)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    formCategory === cat 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between gap-1">
              {DAYS.map((d, i) => {
                const selected = formDays.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (selected) setFormDays(formDays.filter(day => day !== i));
                      else setFormDays([...formDays, i]);
                    }}
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <input 
                  type="time" 
                  value={formStartTime}
                  onChange={e => setFormStartTime(e.target.value)}
                  className="min-w-0 flex-1 appearance-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatTime12h(formStartTime)}
                </span>
              </div>
              <span className="flex items-center text-muted-foreground">to</span>
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <input 
                  type="time" 
                  value={formEndTime}
                  onChange={e => setFormEndTime(e.target.value)}
                  className="min-w-0 flex-1 appearance-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatTime12h(formEndTime)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between pt-1">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setFormColor(c.id)}
                  className={`size-6 rounded-full border-2 transition-all ${
                    formColor === c.id ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            
            <button
              onClick={handleSaveBlock}
              className="mt-2 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {editingId ? "Save Changes" : "Add to Routine"}
            </button>
          </div>
        </div>
        
        {/* Section 3: Saved Blocks */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Saved Routine</h3>
          <div className="mb-3 grid gap-2">
            <button
              type="button"
              onClick={() => selectRoutine("demo")}
              className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                activeRoutine === "demo"
                  ? "border-primary/60 bg-primary/10"
                  : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <div className="text-sm font-medium">Demo Routine</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Click to open the demo calendar
              </div>
            </button>
            <button
              type="button"
              onClick={() => selectRoutine("personal")}
              className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                activeRoutine === "personal"
                  ? "border-primary/60 bg-primary/10"
                  : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <div className="text-sm font-medium">My Routine</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Your saved weekly blocks
              </div>
            </button>
          </div>
          <div className="min-h-[120px] flex-1 overflow-y-auto space-y-2 pr-1">
            {blocks.length === 0 ? (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                No routine blocks yet. Start by adding your university timetable.
              </p>
            ) : (
              blocks.map(b => (
                <div key={b.id} className="flex items-center justify-between rounded-md border border-border bg-background p-2.5 group">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-2.5 rounded-full" 
                      style={{ backgroundColor: COLORS.find(c => c.id === b.color)?.hex || "#8b5cf6" }} 
                    />
                    <div>
                      <div className="text-sm font-medium">{b.label}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {b.days.map(d => DAYS[d]).join(", ")} • {formatTime12h(b.startTime)} - {formatTime12h(b.endTime)}
                      </div>
                    </div>
                  </div>
                  <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => handleEdit(b)} className="p-1.5 text-muted-foreground hover:text-foreground">
                      <Pencil className="size-3.5" />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
              <button onClick={handleResetAll} disabled={blocks.length === 0} className="text-xs font-medium text-destructive hover:underline self-center disabled:cursor-not-allowed disabled:opacity-40">
                Reset All Blocks
              </button>
              <button 
                onClick={onContinueToTasks}
                disabled={blocks.length === 0}
                className="w-full rounded-md border border-primary text-primary py-2.5 text-sm font-medium transition-colors hover:bg-primary/5"
              >
                Continue to Add Tasks →
              </button>
            </div>
        </div>
      </div>
      
      {/* RIGHT PANEL */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/10 px-6 py-3">
          <div className="flex items-center gap-4">
            <button onClick={prevWeek} className="rounded border border-border p-1.5 hover:bg-muted">
              <ChevronLeft className="size-4" />
            </button>
            <div className="text-sm font-medium">
              {weekDays[0] && weekDays[6] && `${format(weekDays[0], "EEE d MMM")} – ${format(weekDays[6], "EEE d MMM yyyy")}`}
            </div>
            <button onClick={nextWeek} className="rounded border border-border p-1.5 hover:bg-muted">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-label={isExpanded ? "Exit full screen" : "View routine in full screen"}
              title={isExpanded ? "Exit full screen" : "View routine in full screen"}
              className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
            <button
              onClick={handleResetAll}
              disabled={blocks.length === 0}
              title="Clear all routine blocks"
              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="size-3.5" />
              Clear calendar
            </button>
            <button onClick={goToToday} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-muted">
              Today
            </button>
          </div>
        </div>
        
        {/* Day Columns Header */}
        <div className="flex border-b border-border bg-card pr-[15px]"> {/* Offset for scrollbar */}
          <div className="w-[60px] shrink-0 border-r border-border" />
          {weekDays.map((date, i) => {
            const isToday = isSameDay(date, startOfToday());
            const isWeekend = i === 5 || i === 6;
            return (
              <div 
                key={i} 
                className={`flex flex-1 flex-col items-center justify-center border-r border-border py-2 ${isWeekend ? 'bg-muted/5' : ''}`}
              >
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {format(date, "EEE")}
                </span>
                <span className={`mt-0.5 text-xl font-bold ${isToday ? "text-primary" : "text-foreground"}`}>
                  {format(date, "d")}
                </span>
                {isToday && <div className="mt-1 size-1 rounded-full bg-primary" />}
              </div>
            );
          })}
        </div>
        
        {/* Grid Body */}
        <div className="relative flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="flex relative min-h-[1536px]"> {/* 24 hours * 64px */}
            
            {/* Time Axis */}
            <div className="w-[60px] shrink-0 border-r border-border bg-card">
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="relative h-16 border-b border-transparent">
                  <span className="absolute -top-2.5 right-2 text-[11px] text-muted-foreground">
                    {formatHour12(h)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Grid Columns */}
            {weekDays.map((date, dayIndex) => {
              const isWeekend = dayIndex === 5 || dayIndex === 6;
              return (
                <div key={dayIndex} className={`relative flex-1 border-r border-border ${isWeekend ? 'bg-muted/5' : ''}`}>
                  {/* Grid Lines */}
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div 
                      key={h} 
                      onClick={() => handleGridClick(dayIndex, h)}
                      className="group relative h-16 border-t border-border/40 cursor-pointer"
                    >
                      <div className="absolute top-8 w-full border-t border-dashed border-border/30" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:bg-primary/5 group-hover:opacity-100">
                        <Plus className="size-4 text-primary/40" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Blocks for this day */}
                  {blocks.filter(b => b.days.includes(dayIndex)).map(block => {
                    const startArr = block.startTime.split(":").map(Number);
                    const endArr = block.endTime.split(":").map(Number);
                    
                    const startHour = startArr[0] ?? 0;
                    const startMin = startArr[1] ?? 0;
                    const endHour = endArr[0] ?? 0;
                    const endMin = endArr[1] ?? 0;

                    const topPx = (startHour * 64) + (startMin / 60 * 64);
                    const endPx = (endHour * 64) + (endMin / 60 * 64);
                    const heightPx = Math.max(endPx - topPx, 20); // Min height
                    const colorHex = COLORS.find(c => c.id === block.color)?.hex || "#8b5cf6";
                    
                    return (
                      <div 
                        key={`${block.id}-${dayIndex}`}
                        className="absolute inset-x-1 group z-10 overflow-hidden rounded-md border-l-[3px] transition-all hover:brightness-110"
                        style={{
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                          backgroundColor: `${colorHex}1A`, // 10% opacity hex
                          borderLeftColor: colorHex
                        }}
                      >
                        <div className="p-1.5">
                          <div className="truncate text-xs font-medium leading-tight text-foreground">{block.label}</div>
                          <div className="mt-0.5 text-[10px] text-muted-foreground">{formatTime12h(block.startTime)} - {formatTime12h(block.endTime)}</div>
                        </div>
                        <div className="absolute right-1 top-1 flex opacity-0 transition-opacity group-hover:opacity-100 bg-background/80 rounded backdrop-blur-sm shadow-sm">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(block); }} className="p-1 text-muted-foreground hover:text-foreground">
                            <Pencil className="size-3" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(block.id); }} className="p-1 text-muted-foreground hover:text-destructive">
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              );
            })}
            
            {/* Global Sleep & Wake Lines */}
            {(() => {
              const wakeArr = (sleepBounds.wakeTime || "08:00").split(":").map(Number);
              const bedArr = (sleepBounds.bedTime || "23:00").split(":").map(Number);
              
              const wakeHour = wakeArr[0] ?? 8;
              const wakeMin = wakeArr[1] ?? 0;
              const bedHour = bedArr[0] ?? 23;
              const bedMin = bedArr[1] ?? 0;

              const wakeTop = (wakeHour * 64) + (wakeMin / 60 * 64);
              const bedTop = (bedHour * 64) + (bedMin / 60 * 64);
              
              return (
                <>
                  <div className="pointer-events-none absolute left-[60px] right-0 z-20 border-t border-violet-500/60" style={{ top: `${wakeTop}px` }}>
                    <div className="absolute -top-3 left-1 flex items-center gap-1 rounded bg-background/80 px-1 py-0.5 text-[10px] font-medium text-violet-500">
                      <Sunrise className="size-3" />
                      Wake
                    </div>
                  </div>
                  <div className="pointer-events-none absolute left-[60px] right-0 z-20 border-t border-rose-500/60" style={{ top: `${bedTop}px` }}>
                    <div className="absolute -top-3 left-1 flex items-center gap-1 rounded bg-background/80 px-1 py-0.5 text-[10px] font-medium text-rose-500">
                      <Moon className="size-3" />
                      Sleep
                    </div>
                  </div>
                </>
              )
            })()}
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
