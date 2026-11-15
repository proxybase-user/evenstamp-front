'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getAnomalyInfo } from '@/lib/anomaly-dictionary';
import FindingInfoModal from './FindingInfoModal';

export interface SessionFindingsBadgesProps {
  anomalies: string[];
}

export default function SessionFindingsBadges({
  anomalies,
}: SessionFindingsBadgesProps) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  return (
    <>
      {anomalies.length === 0 ? (
        <button
          type="button"
          onClick={() => setSelectedCode('CLEAN')}
          className="inline-flex items-center gap-1 rounded-[4px] border border-accent-green/30 bg-accent-green/10 px-2 py-0.5 text-[10px] font-medium text-accent-green transition hover:bg-accent-green/20 hover:border-accent-green/50 cursor-pointer"
          title="All security probes passed cleanly - click to view details"
        >
          <CheckCircle2 className="h-3 w-3" />
          Clean
        </button>
      ) : (
        <div className="flex flex-wrap gap-1 max-w-[22rem]">
          {anomalies.map((anomaly) => {
            const info = getAnomalyInfo(anomaly);
            const badgeStyle =
              info.severity === 'high'
                ? 'border-accent-red/30 bg-accent-red/10 text-accent-red hover:bg-accent-red/20 hover:border-accent-red/50'
                : info.severity === 'medium'
                  ? 'border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow hover:bg-accent-yellow/20 hover:border-accent-yellow/50'
                  : 'border-accent-blue/30 bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 hover:border-accent-blue/50';

            return (
              <button
                key={anomaly}
                type="button"
                onClick={() => setSelectedCode(anomaly)}
                title={`Click to view explanation for "${info.title}"`}
                className={`inline-block rounded-[4px] border px-1.5 py-0.5 text-[10px] font-medium transition cursor-pointer active:scale-95 text-left ${badgeStyle}`}
              >
                {info.badge}
              </button>
            );
          })}
        </div>
      )}

      <FindingInfoModal
        code={selectedCode}
        onClose={() => setSelectedCode(null)}
      />
    </>
  );
}
