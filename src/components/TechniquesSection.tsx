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
          <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[44.8px] lg:leading-[46.6px]">
            Eight forensic layers. Any contradiction raises the score.
          </h2>
          <p className="max-w-[65ch] text-base leading-relaxed text-ink-body">
            Anti-detect browsers patch surface APIs. These probes target the
            subsystems underneath: kernel packet headers, GPU scheduling,
            graphics readback paths, inspector serializers, OS voice
            inventories, and human motor control.
          </p>
        </div>
        <div className="card-feature shrink-0 !p-4 font-mono text-[11px] text-ink-muted">
          <div className="text-accent-blue font-semibold">DETERMINISTIC RULES</div>
          <div className="mt-1">score = Σ signal weights · clamp 0–100</div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {TECHNIQUES.map((technique) => {
          const Icon = ICONS[technique.icon] ?? Activity;
          return (
            <article
              key={technique.id}
              className="card-feature transition-colors hover:border-accent-blue"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-hairline bg-surface-2 text-accent-blue">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-ink-muted">
                      {technique.index}
                    </span>
                    <span className="rounded-[4px] border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                      {technique.layer}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">
                    {technique.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-body">
                    {technique.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {technique.flags.map((flag) => (
                      <span
                        key={flag}
                        className="rounded-[4px] border border-accent-red/20 bg-accent-red/10 px-2 py-0.5 font-mono text-[10px] text-accent-red"
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
