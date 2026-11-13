import { Plus } from 'lucide-react';
import SectionFrame from './SectionFrame';
import { FAQ_ITEMS } from '@/lib/site-data';

export default function FaqSection() {
  return (
    <SectionFrame id="faq">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <div className="eyebrow">// Operator questions</div>
          <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.025em]">
            The questions engineers ask first.
          </h2>
          <p className="max-w-[42ch] text-sm leading-relaxed text-ink-secondary">
            If yours is not here, send it to{' '}
            <a
              href="mailto:engineering@evenstamp.com"
              className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 transition hover:decoration-emerald-400"
            >
              engineering@evenstamp.com
            </a>
            . A systems engineer answers, not a sales sequence.
          </p>
        </div>

        <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink-primary [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus
                  className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[65ch] pt-3 text-sm leading-relaxed text-ink-secondary">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
