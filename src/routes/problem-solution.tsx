import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, HeartPulse, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/problem-solution")({
  head: () => ({
    meta: [
      { title: "Problem & Solution — NeuroFlow" },
      { name: "description", content: "Why university students struggle with time management and how NeuroFlow addresses the root cause." },
      { property: "og:title", content: "Problem & Solution — NeuroFlow" },
      { property: "og:description", content: "A research-backed investigation into student scheduling and wellbeing." },
    ],
  }),
  component: ProblemPage,
});

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.6, delay, ease: "easeOut" }}>{children}</motion.div>;
}

function FadeText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay, ease: "easeOut" }}>{children}</motion.div>;
}

const evidence = [
  ["43%", "Global Student Burnout Rate", "of students worldwide experienced academic burnout in the current semester — not occasionally, but as their ongoing baseline state", "Chegg Global Student Survey 2025 · n=11,706 undergraduates · 15 countries"],
  ["55%", "Chronic Sleep Deprivation", "of undergraduate students report not getting enough sleep due to academic overload — impairing memory consolidation, emotional regulation, and cognitive performance", "Chegg Global Student Survey 2025 · n=11,706 undergraduates · 15 countries"],
  ["68%", "Students Working While Enrolled", "of surveyed students were employed while enrolled in university, many working 20 or more hours per week alongside a full academic load", "Hope Center Student Basic Needs Survey 2023–24 · n=74,350 · 91 colleges"],
  ["2 in 5", "Academic Mental Health Impact", "students report that their mental health impairs their ability to focus and perform academically to a significant degree", "Healthy Minds Study 2024–25 · n=84,000+ · 135 institutions"],
] as const;

const outcomes = [
  [ShieldCheck, "Prevents Burnout", "Burnout is not caused by hard work. It is caused by hard work without adequate recovery, scheduled at the wrong times, beyond the cognitive limits of the individual. NeuroFlow protects recovery by design."],
  [HeartPulse, "Protects Personal Life", "NeuroFlow treats hobbies, social connection, exercise, and rest as scheduling inputs with equal weight to academic tasks. Personal life is built into the week first, not considered last."],
  [Target, "Improves Academic Output", "Tasks placed at chronotype-matched peak cognitive hours produce better work in less time. NeuroFlow asks students to work at the right time, not simply work harder."],
] as const;

function ProblemPage() {
  return (
    <div className="overflow-hidden pb-24">
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10 lg:pb-32">
        <div className="pointer-events-none absolute right-0 top-24 -z-10 size-[32rem] rounded-full bg-primary/10 blur-[130px]" />
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles className="size-3.5" /> Designathon 2026 — GDC RIT Dubai × +TWE</span>
          <h1 className="mt-7 max-w-4xl text-6xl font-bold leading-[0.95] tracking-tight sm:text-8xl">Problem <span className="text-primary">&amp;</span> Solution</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">A research-backed investigation into why university students struggle to manage their time, and how NeuroFlow addresses it at the root cause rather than the surface.</p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
        <Reveal><div className="lg:sticky lg:top-28"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The problem</span><h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">University students are losing their personal lives to unplanned academic chaos.</h2></div></Reveal>
        <div className="space-y-7 text-base leading-8 text-muted-foreground"><FadeText><p>University students today manage more competing demands than any previous generation. Coursework, part-time employment, social obligations, mental health maintenance, and career preparation all compete for the same finite hours. Yet generic to-do apps, rigid weekly planners, and shared digital calendars treat every student as if they were identical. They ignore the biological reality that a student who reaches peak cognitive performance at 7am and one who peaks at 10pm require fundamentally different schedules.</p></FadeText><FadeText delay={0.08}><p>The result is a generation who are technically busy but cognitively misaligned. They study at the wrong times, overload the wrong days, skip recovery, and sacrifice personal lives not because they lack discipline, but because no tool has shown them how their own brain works. Burnout, chronic sleep deprivation, academic underperformance, and social isolation follow as predictable outcomes of a broken planning system.</p></FadeText><FadeText delay={0.16}><p>Existing solutions address the symptoms: better task lists, prettier calendars, smarter reminders. None addresses the underlying neuroscience of when, how, and in what sequence a specific student should work. That gap is what NeuroFlow is built to close.</p></FadeText></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><Reveal><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The evidence</span><h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">This isn't anecdotal. The data is overwhelming.</h2></Reveal><div className="mt-12 grid gap-4 sm:grid-cols-2">{evidence.map(([number, title, body, source], index) => <Reveal key={title} delay={index * 0.08}><article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/[0.08] hover:shadow-[inset_0_0_34px_rgba(139,92,246,0.12),0_0_28px_rgba(139,92,246,0.16)]"><div className="text-5xl font-bold tracking-tight text-primary transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_18px_rgba(167,119,255,0.7)]">{number}</div><h3 className="mt-8 text-xl font-semibold">{title}</h3><FadeText delay={0.1}><p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p></FadeText><FadeText delay={0.16}><p className="mt-8 border-t border-white/10 pt-4 text-[10px] uppercase leading-5 tracking-wider text-primary/80">{source}</p></FadeText></article></Reveal>)}</div><FadeText><p className="mx-auto mt-12 max-w-4xl text-center text-base italic leading-8 text-muted-foreground">These statistics are interconnected symptoms of the same root problem: students planning their weeks without understanding how their individual brain works. The cycle is predictable. It is also preventable.</p><p className="mt-8 text-center text-[10px] uppercase tracking-wider text-muted-foreground">Sources: Chegg Global Student Survey 2025 · Hope Center Student Basic Needs Survey · Healthy Minds Study 2024–25 · Inside Higher Ed Student Voice Survey 2024</p></FadeText></section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[0.72fr_1.28fr] lg:px-10"><Reveal><div className="lg:sticky lg:top-28"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The solution</span><h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">NeuroFlow — a smart weekly scheduler that understands how you think.</h2></div></Reveal><div className="space-y-7 text-base leading-8 text-muted-foreground"><FadeText><p>NeuroFlow is not a to-do list, a calendar app, or a productivity framework with a prettier interface. It is a personalised schedule generator that begins by understanding the student: their chronotype, focus style, cognitive load tolerance, motivation architecture, energy recovery pattern, and procrastination profile.</p></FadeText><FadeText delay={0.08}><p>The process has four stages. First, a six-question neuroscience-backed assessment maps the student's cognitive profile. Second, the student locks in fixed weekly anchors: university classes, gym sessions, meal times, and sleep boundaries. Third, the student adds tasks with deadlines, effort levels, split preferences, and priorities. Fourth, NeuroFlow's AI engine generates a fully personalised weekly plan.</p></FadeText><FadeText delay={0.16}><p>Every block is placed with intention. Heavy academic tasks go at chronotype-matched peak hours. Study lengths match the student's natural focus window. Recovery time is built in, and personal time is allocated as a first-class input alongside academic tasks. The result accounts for the student as a whole person, not just a list of assignments.</p></FadeText></div></section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><Reveal><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why it matters</span><h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">This isn't just a productivity tool. It's a student wellbeing intervention.</h2></Reveal><div className="mt-12 grid gap-4 lg:grid-cols-3">{outcomes.map(([Icon, title, body], index) => <Reveal key={title} delay={index * 0.1}><article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/[0.08] hover:shadow-[inset_0_0_34px_rgba(139,92,246,0.12),0_0_28px_rgba(139,92,246,0.16)]"><Icon className="size-6 text-primary transition-transform duration-300 group-hover:scale-110" /><h3 className="mt-14 text-2xl font-semibold">{title}</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">{body}</p></article></Reveal>)}</div></section>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10"><Reveal><div className="rounded-[2rem] border border-primary/25 bg-primary/[0.07] px-6 py-20 sm:px-12"><BrainCircuit className="mx-auto size-7 text-primary" /><h2 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Ready to build a week that actually works for your brain?</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground">Take the NeuroFlow assessment in two minutes and get a personalised weekly schedule built around your neuroscience profile.</p><Link to="/scheduler" className="mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">Take the Assessment <ArrowRight className="size-4" /></Link><p className="mt-6 text-xs text-muted-foreground">Free · No account required · 6 questions · Powered by Gemini</p></div></Reveal></section>
      <SiteFooter />
    </div>
  );
}