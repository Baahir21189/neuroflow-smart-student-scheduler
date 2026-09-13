import { Link } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 px-6 py-10 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <BrainCircuit className="size-4" />
          </span>
          NeuroFlow
        </Link>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          <Link to="/problem-solution" className="transition-colors hover:text-foreground">Problem &amp; Solution</Link>
          <Link to="/scheduler" className="transition-colors hover:text-foreground">Scheduler</Link>
        </div>
        <p>© 2026 Mohammed Baahir Yusuf</p>
      </div>
    </footer>
  );
}
