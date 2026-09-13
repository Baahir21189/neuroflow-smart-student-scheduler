import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  Clock3,
  Orbit,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import brainAnimation from "@/assets/Brain animation.mp4";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroFlow — A Week Designed Around Your Brain" },
      { name: "description", content: "NeuroFlow maps your chronotype, focus style, and motivation pattern to build a weekly schedule around how your brain works." },
      { property: "og:title", content: "NeuroFlow — A Week Designed Around Your Brain" },
      { property: "og:description", content: "A neuroscience-backed weekly scheduler for students." },
    ],
  }),
  component: HomePage,
});

const stats = [
  ["43%", "of students worldwide experience burnout every semester", "Chegg Global Student Survey 2025"],
  ["55%", "don't get enough sleep due to academic overload", "Chegg Global Student Survey 2025"],
  ["2 in 5", "students say academics have destroyed their personal life", "Healthy Minds Study 2024–25"],
] as const;

const process = [
  ["01", "Discover Your Brain Profile", "A six-question assessment maps your chronotype, focus style, cognitive load, motivation, recovery, and procrastination profile."],
  ["02", "Set Your Fixed Routine", "Lock in classes, gym sessions, meals, sleep boundaries, and every recurring anchor your week must respect."],
  ["03", "Add This Week's Tasks", "Tell NeuroFlow what needs doing. Add deadlines, effort levels, priorities, and the personal commitments that matter too."],
  ["04", "Get Your Smart Schedule", "The AI engine places every block at the right time for your specific brain, with a reason behind every decision."],
] as const;

const science = [
  [Orbit, "Chronotype", "Your biological clock determines when your brain reaches peak cognitive performance. NeuroFlow places your hardest work at your biological prime time.", "Roenneberg et al · Munich Chronotype Questionnaire"],
  [Clock3, "Ultradian Rhythm", "The brain naturally cycles through approximately 90-minute windows of high focus followed by rest. Your study blocks should respect that rhythm.", "Peretz Lavie · Sleep Research Institute"],
  [Target, "Motivation Architecture", "Students differ in how deadline proximity affects performance. NeuroFlow identifies your pattern and schedules accordingly, not generically.", "Deci & Ryan · University of Rochester"],
] as const;

const types = [
  ["Morning Architect", "You do your sharpest thinking before the world gets loud.", "Morning Peak · Deep Focus · Progress-Driven"],
  ["Burst Architect", "You work fast, focus hard, and finish strong under pressure.", "Morning Peak · Sprint Focus · Deadline-Driven"],
  ["Night Builder", "Your best work happens when most people are already asleep.", "Evening Peak · Deep Focus · Deadline-Driven"],
  ["Steady Drifter", "You work best when your week has shape without rigidity.", "Midday Peak · Flexible Focus · Balanced Drive"],
] as const;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function FadeText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function HomePage() {
  const { scrollYProgress } = useScroll();
  const brainY = useTransform(scrollYProgress, [0, 0.45], [0, -90]);
  const brainScale = useTransform(scrollYProgress, [0, 0.45], [1, 1.12]);

  return (
    <div className="overflow-hidden pb-24">
      <section className="relative isolate flex min-h-[calc(112svh-4rem)] items-center overflow-hidden px-6 py-16 lg:px-10">
        <motion.div style={{ y: brainY, scale: brainScale }} className="absolute inset-0 -z-20 h-full w-full bg-background">
          <video className="size-full object-cover opacity-75 mix-blend-screen" autoPlay muted playsInline src={brainAnimation} />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,12,17,0.98)_0%,rgba(13,12,17,0.82)_34%,rgba(13,12,17,0.38)_68%,rgba(13,12,17,0.8)_100%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_46%,rgba(139,92,246,0.12),transparent_35%),linear-gradient(180deg,rgba(13,12,17,0.25),rgba(13,12,17,0.72))]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles className="size-3.5" /> Neuroscience-backed weekly scheduling</span>
            <h1 className="mt-5 max-w-2xl text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl">Your week, finally designed around how you <span className="text-primary">actually think.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">NeuroFlow maps your chronotype, focus style, and motivation pattern, then builds your week around your brain, not against it. No more guessing. No more burnout. Just a week that works.</p>
            <div className="mt-7 flex flex-wrap items-center gap-4"><Link to="/scheduler" className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">Build My Schedule <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link><a href="#science" onClick={(event) => { event.preventDefault(); document.getElementById("science")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">See the science <ArrowDownRight className="size-4" /></a></div>
          </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10"><div className="grid border-y border-border/70 md:grid-cols-3">{stats.map(([value, label, source], index) => <Reveal key={value} delay={index * 0.1}><div className="group border-border/70 py-10 transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[0_0_24px_rgba(167,119,255,0.18)] md:px-8 md:first:pl-0 md:not-first:border-l"><div className="text-4xl font-bold tracking-tight text-primary transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_18px_rgba(167,119,255,0.65)] sm:text-5xl">{value}</div><p className="mt-3 max-w-xs text-sm leading-6 text-foreground/80">{label}</p><p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{source}</p></div></Reveal>)}</div><Reveal><p className="mx-auto max-w-2xl py-12 text-center text-lg italic leading-8 text-muted-foreground">The problem isn't that students don't work hard enough. It's that they plan their weeks without knowing how their brain works.</p></Reveal></section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.7fr_1.3fr] lg:px-10"><Reveal><div className="lg:sticky lg:top-28 lg:h-fit"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The process</span><h2 className="mt-5 max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Four steps from chaos to a week that works.</h2></div></Reveal><div className="grid gap-4">{process.map(([number, title, body], index) => <Reveal key={number} delay={index * 0.08}><article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-7 shadow-[inset_0_0_0_rgba(167,119,255,0)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/[0.08] hover:shadow-[inset_0_0_34px_rgba(139,92,246,0.12),0_0_28px_rgba(139,92,246,0.16)] sm:p-9"><div className="flex items-start justify-between gap-6"><span className="text-sm font-semibold text-primary">{number}</span><ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" /></div><h3 className="mt-12 text-2xl font-semibold tracking-tight">{title}</h3><FadeText delay={0.1}><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{body}</p></FadeText></article></Reveal>)}</div></section>

      <section id="science" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-10"><Reveal><div className="max-w-2xl"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The neuroscience</span><h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Not another to-do list. A schedule built on how your brain works.</h2></div></Reveal><div className="mt-12 grid gap-4 lg:grid-cols-3">{science.map(([Icon, title, body, source], index) => <Reveal key={title} delay={index * 0.1}><article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-7 shadow-[inset_0_0_0_rgba(167,119,255,0)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/[0.08] hover:shadow-[inset_0_0_34px_rgba(139,92,246,0.12),0_0_28px_rgba(139,92,246,0.16)]"><Icon className="size-6 text-primary transition-transform duration-300 group-hover:scale-110" /><h3 className="mt-14 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p><p className="mt-7 border-t border-white/10 pt-4 text-[11px] uppercase tracking-wider text-primary/80">{source}</p></article></Reveal>)}</div></section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><Reveal><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your type</span><h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Which one are you?</h2></div><p className="max-w-md text-sm leading-7 text-muted-foreground">NeuroFlow identifies your cognitive profile from six questions. Here’s what each type looks like, and what it means for your week.</p></div></Reveal><div className="mt-12 grid gap-4 sm:grid-cols-2">{types.map(([name, tagline, traits], index) => <Reveal key={name} delay={index * 0.08}><article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-7 shadow-[inset_0_0_0_rgba(167,119,255,0)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/[0.08] hover:shadow-[inset_0_0_34px_rgba(139,92,246,0.12),0_0_28px_rgba(139,92,246,0.16)]"><div className="flex items-center justify-between"><span className="text-sm text-primary">0{index + 1}</span><Zap className="size-4 text-primary/70 transition-transform duration-300 group-hover:scale-110" /></div><h3 className="mt-12 text-2xl font-semibold tracking-tight">{name}</h3><p className="mt-3 text-sm italic leading-6 text-muted-foreground">“{tagline}”</p><p className="mt-8 text-xs font-medium uppercase tracking-wider text-primary">{traits}</p></article></Reveal>)}</div></section>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10"><div className="rounded-[2rem] border border-primary/25 bg-primary/[0.07] px-6 py-20 sm:px-12"><Sparkles className="mx-auto size-6 text-primary" /><h2 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Stop planning your week by guessing. Start planning it around your brain.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground">NeuroFlow takes six questions and two minutes. What you get back is a week designed specifically for how your brain works, with your personal life built in.</p><Link to="/scheduler" className="mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">Take the Assessment <ArrowRight className="size-4" /></Link><p className="mt-6 text-xs text-muted-foreground">6 questions · 2 minutes · No account required · Powered by Gemini</p></div></section>
      <SiteFooter />
    </div>
  );
}