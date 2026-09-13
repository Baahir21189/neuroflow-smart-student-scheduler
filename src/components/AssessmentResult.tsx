import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BedDouble, BrainCircuit, Palette, Sunrise, Zap } from "lucide-react";
import {
  academicsBullets,
  personalBullets,
  traitPills,
  TYPE_CONTENT,
  type FlowwProfile,
} from "@/lib/profile";

interface Props {
  profile: FlowwProfile;
  condensed?: boolean;
  hideActions?: boolean;
  profileView?: boolean;
  onSetUpRoutine: () => void;
  onRetake: () => void;
}

const weekRows = [
  { key: "wake", label: "Ideal Wake Time", icon: Sunrise },
  { key: "bed", label: "Ideal Bed Time", icon: BedDouble },
  { key: "peak", label: "Peak Study Window", icon: Zap },
  { key: "personal", label: "Personal Time", icon: Palette },
] as const;

function Pills({ profile, stagger }: { profile: FlowwProfile; stagger: boolean }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {traitPills(profile).map((pill, i) => (
        <motion.span
          key={pill}
          initial={stagger ? { opacity: 0, x: -14 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: stagger ? 0.35 + i * 0.08 : 0, duration: 0.3 }}
          className="rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary"
        >
          {pill}
        </motion.span>
      ))}
    </div>
  );
}

function WeekCard({ profile }: { profile: FlowwProfile }) {
  const week = TYPE_CONTENT[profile.type].week;
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-6">
      <h3 className="text-lg font-semibold tracking-tight">
        Your Ideal Week Structure
      </h3>
      <div className="mt-5 flex flex-col divide-y divide-border">
        {weekRows.map((row) => (
          <div key={row.key} className="flex items-center justify-between py-3.5">
            <span className="flex items-center gap-3 text-sm text-muted-foreground">
              <row.icon className="size-4 text-primary" />
              {row.label}
            </span>
            <span className="text-sm font-medium text-primary">
              {week[row.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetakeButton({ onRetake }: { onRetake: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        Retake Assessment
      </button>
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm"
            onClick={() => setConfirming(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="text-lg font-semibold">Reset your profile?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This will reset your profile and all saved data. Are you sure?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onRetake}
                  className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90"
                >
                  Yes, reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const profileTraits = [
  ["Chronotype", "chronotype"],
  ["Focus style", "focusStyle"],
  ["Cognitive load", "cognitiveLoad"],
  ["Motivation", "motivation"],
  ["Energy recovery", "energyRecovery"],
  ["Procrastination", "procrastination"],
] as const;

function ProfileOverview({ profile }: { profile: FlowwProfile }) {
  const content = TYPE_CONTENT[profile.type];
  const week = content.week;

  return (
    <div className="mx-auto max-w-4xl py-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15">
              <BrainCircuit className="size-5" />
            </span>
            My cognitive profile
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-primary sm:text-5xl">{content.name}</h2>
          <p className="mt-3 max-w-xl text-sm italic leading-6 text-muted-foreground">“{content.tagline}”</p>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">Assessment complete</span>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.45 }}
        className="mt-8"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Your signals</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">How your brain prefers to work</h3>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:block">6 dimensions mapped</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {profileTraits.map(([label, key], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + index * 0.05 }}
              className="rounded-xl border border-border bg-secondary/25 p-4"
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm font-semibold capitalize text-foreground">{profile.traits[key]}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="rounded-2xl border border-border bg-secondary/20 p-6"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Your operating pattern</p>
          <p className="mt-4 text-sm leading-7 text-foreground/90">{content.howYouThink}</p>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.45 }}
          className="rounded-2xl border border-primary/25 bg-primary/[0.07] p-6"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Weekly rhythm</p>
          <div className="mt-4 space-y-4">
            <div><p className="text-xs text-muted-foreground">Peak study window</p><p className="mt-1 text-sm font-semibold text-primary">{week.peak}</p></div>
            <div><p className="text-xs text-muted-foreground">Personal time</p><p className="mt-1 text-sm font-semibold text-primary">{week.personal}</p></div>
            <div><p className="text-xs text-muted-foreground">Sleep boundary</p><p className="mt-1 text-sm font-semibold text-primary">{week.wake} wake · {week.bed} bed</p></div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export function AssessmentResult({
  profile,
  condensed = false,
  hideActions = false,
  profileView = false,
  onSetUpRoutine,
  onRetake,
}: Props) {
  if (profileView) return <ProfileOverview profile={profile} />;

  const content = TYPE_CONTENT[profile.type];
  const animate = !condensed;

  const rise = (delay: number) =>
    animate
      ? {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.45, ease: "easeOut" as const },
        }
      : {};

  return (
    <div className="mx-auto max-w-[680px] py-4">
      {/* Section 1 — Type header */}
      <div>
        <motion.h2
          initial={animate ? { opacity: 0, scale: 0.9 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl font-bold tracking-tight text-primary sm:text-4xl"
        >
          {content.name}
        </motion.h2>
        <Pills profile={profile} stagger={animate} />
        <motion.p
          {...rise(0.6)}
          className="mt-4 text-sm italic text-muted-foreground"
        >
          “{content.tagline}”
        </motion.p>
      </div>

      {/* Section 2 — Two column layout */}
      {!condensed && (
        <motion.div {...rise(0.7)} className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              How You Think
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              {content.howYouThink}
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                For Your Academics
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {academicsBullets(profile).map((b) => (
                  <li
                    key={b}
                    className="flex gap-2.5 text-sm leading-relaxed text-foreground/90"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                For Your Personal Life
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {personalBullets(profile).map((b) => (
                  <li
                    key={b}
                    className="flex gap-2.5 text-sm leading-relaxed text-foreground/90"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section 3 — Ideal week */}
      <motion.div {...rise(condensed ? 0 : 0.85)} className="mt-10">
        <WeekCard profile={profile} />
      </motion.div>

      {!hideActions && (
        <motion.div
          {...rise(condensed ? 0 : 1)}
          className="mt-10 flex flex-col items-center gap-5 pb-4"
        >
          <button
            type="button"
            onClick={onSetUpRoutine}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Set Up My Routine
            <ArrowRight className="size-4" />
          </button>
          <RetakeButton onRetake={onRetake} />
        </motion.div>
      )}
    </div>
  );
}
