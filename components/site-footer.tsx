import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = [
  {
    title: "Leagues",
    links: [
      { label: "NBA", href: "/nba" },
      { label: "NFL", href: "/nfl" },
      { label: "Scores", href: "/scores" },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Community", href: "/community" },
      { label: "Betting Odds", href: "/betting" },
      { label: "Fantasy Hub", href: "/fantasy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase leading-none tracking-wider text-foreground">
                  The Athlete
                </span>
                <span className="text-[10px] font-bold uppercase leading-none tracking-widest text-primary">
                  Insider
                </span>
              </div>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your premium source for NBA & NFL news, scores, analysis, and
              community-driven sports content.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} The Athlete Insider. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
