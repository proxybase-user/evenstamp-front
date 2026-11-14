import { Plus } from 'lucide-react';
import SectionFrame from './SectionFrame';
import { FAQ_ITEMS } from '@/lib/site-data';

export default function FaqSection() {
  return (
    <SectionFrame id="faq">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <div className="eyebrow">// Common questions</div>
          <h2 className="text-3xl font-semibold leading-[1.12] sm:text-4xl text-ink">
            Frequently asked questions.
          </h2>
          <p className="max-w-[42ch] text-sm leading-relaxed text-ink-body">
            Have questions about fraud prevention, setup, or volume pricing? Contact{' '}
            <a
              href="mailto:engineering@evenstamp.com"
              className="text-accent-blue underline underline-offset-4 transition hover:opacity-80"
            >
              engineering@evenstamp.com
            </a>
            {' '}and our team will answer directly.
          </p>
        </div>

        <div className="divide-y divide-hairline border-y border-hairline">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus
                  className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[65ch] pt-3 text-sm leading-relaxed text-ink-body">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
