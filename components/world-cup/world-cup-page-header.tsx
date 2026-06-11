import { Globe } from "lucide-react";

export function WorldCupPageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <Globe className="h-7 w-7 text-primary" />
      </div>
      <div className="h-10 w-1.5 rounded-full bg-primary" />
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
