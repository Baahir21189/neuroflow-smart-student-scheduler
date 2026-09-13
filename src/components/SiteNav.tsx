import { Link } from "@tanstack/react-router";
import { BrainCircuit, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/problem-solution", label: "Problem & Solution" },
  { to: "/scheduler", label: "Scheduler" },
] as const;

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="relative mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <BrainCircuit className="size-4.5" />
          </span>
          <span className="text-[17px] font-bold tracking-tight">NeuroFlow</span>
        </Link>
        <button type="button" aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)} className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground sm:hidden">
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <div className={`${isOpen ? "flex" : "hidden"} absolute inset-x-4 top-[calc(100%-1px)] flex-col gap-1 rounded-b-2xl border border-t-0 border-border/60 bg-background/95 p-3 backdrop-blur-xl sm:static sm:flex sm:flex-row sm:items-center sm:gap-1 sm:border-0 sm:bg-transparent sm:p-0`}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              onClick={() => setIsOpen(false)}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:px-4"
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
