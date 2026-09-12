import { Link } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/problem-solution", label: "Problem & Solution" },
  { to: "/scheduler", label: "Scheduler" },
] as const;

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <BrainCircuit className="size-4.5" />
          </span>
          <span className="text-[17px] font-bold tracking-tight">NeuroFlow</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
