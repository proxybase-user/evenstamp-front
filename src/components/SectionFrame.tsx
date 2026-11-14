import type { ReactNode } from 'react';

function Crosshairs() {
  return (
    <>
      <span className="crosshair -left-[5px] -top-[5px]" aria-hidden="true" />
      <span className="crosshair -right-[5px] -top-[5px]" aria-hidden="true" />
      <span className="crosshair -bottom-[5px] -left-[5px]" aria-hidden="true" />
      <span className="crosshair -bottom-[5px] -right-[5px]" aria-hidden="true" />
    </>
  );
}

export default function SectionFrame({
  id,
  children,
  className = '',
  contentClassName = 'px-5 py-16 sm:px-8 sm:py-20 lg:py-24',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section id={id} className={`relative bg-canvas transition-colors ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="hairline-frame relative">
          <Crosshairs />
          <div className={contentClassName}>{children}</div>
        </div>
      </div>
    </section>
  );
}
