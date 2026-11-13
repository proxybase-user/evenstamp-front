import {
  Activity,
  AudioLines,
  Cpu,
  Eye,
  Globe2,
  Layers,
  Network,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import SectionFrame from './SectionFrame';
import { TECHNIQUES } from '@/lib/site-data';

const ICONS: Record<string, LucideIcon> = {
  network: Network,
  eye: Eye,
  cpu: Cpu,
  terminal: Terminal,
  audio: AudioLines,
  globe: Globe2,
  layers: Layers,
  activity: Activity,
};

export default function TechniquesSection() {
  return (
    <SectionFrame id="detection">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="eyebrow">// Detection surface</div>
          <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-4xl">
            Eight forensic layers. Any contradiction raises the score.
          </h2>
          <p className="max-w-[65ch] text-base leading-relaxed text-ink-secondary">
            Anti-detect browsers patch surface APIs. These probes target the
            subsystems underneath: kernel packet headers, GPU scheduling,
            graphics readback paths, inspector serializers, OS voice
            inventories, and human motor control.
          </p>
        </div>
        <div className="shrink-0 rounded-lg border border-white/[0.07] bg-surface-1 px-4 py-3 font-mono text-[11px] text-ink-muted shadow-specular">
          <div className="text-emerald-400">DETERMINISTIC RULES</div>
          <div className="mt-1">score = Σ signal weights · clamp 0–100</div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {TECHNIQUES.map((technique) => {
          const Icon = ICONS[technique.icon] ?? Activity;
          return (
            <article
              key={technique.id}
              className="surface-card group rounded-xl p-5 transition-colors hover:border-cyan-500/25"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/[0.08] text-cyan-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-ink-muted">
                      {technique.index}
                    </span>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                      {technique.layer}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold tracking-[-0.01em]">
                    {technique.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-secondary">
                    {technique.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {technique.flags.map((flag) => (
                      <span
                        key={flag}
                        className="rounded border border-rose-500/20 bg-rose-500/[0.07] px-1.5 py-0.5 font-mono text-[9px] text-rose-300/90"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}
