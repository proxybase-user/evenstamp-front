import { KeyRound, Trash2 } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import AddSiteForm from '@/components/dashboard/AddSiteForm';
import ConfirmSubmit from '@/components/dashboard/ConfirmSubmit';
import { deleteSiteAction } from '@/app/dashboard/actions';
import { getSites, requireUser } from '@/lib/account';
import { snippetOrigin } from '@/lib/auth';
import { formatNumber, timeAgo } from '@/lib/format';

export default async function SitesPage() {
  await requireUser('/dashboard/sites');
  const sites = await getSites();
  const origin = snippetOrigin();

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">// Sites &amp; site keys</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl text-ink">
          Install Evenstamp on your website.
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-body">
          Every site gets a public key. The key scopes challenges, ingests, and
          dashboard findings to this account; it is not a secret and cannot read
          another account&apos;s data.
        </p>
      </div>

      <AddSiteForm />

      {sites.length === 0 ? (
        <div className="card-feature !p-8 text-center text-sm text-ink-body">
          No sites yet. Create one above to generate its key and snippet.
        </div>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => {
            const snippet = `<script src="${origin}/embed/v1.js" data-site-key="${site.siteKey}" async></script>`;
            return (
              <article key={site.siteId} className="card-feature !p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-ink">{site.name}</h2>
                      <span className="rounded-[4px] border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                        {site.domain}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-ink-muted">
                      {formatNumber(site.sessions30d)} sessions / 30d · last seen{' '}
                      {timeAgo(site.lastSessionAt)}
                    </p>
                  </div>

                  <form action={deleteSiteAction} className="shrink-0">
                    <input type="hidden" name="siteId" value={site.siteId} />
                    <ConfirmSubmit
                      message={`Delete ${site.name}? Session history stays in the engine, but the site key stops working immediately.`}
                      className="inline-flex items-center gap-1.5 rounded-[4px] border border-accent-red/25 bg-accent-red/10 px-2.5 py-1.5 font-mono text-[11px] text-accent-red transition hover:bg-accent-red/15"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      Delete site
                    </ConfirmSubmit>
                  </form>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                  <div className="rounded-[4px] border border-hairline bg-surface-2 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                        <KeyRound className="h-3 w-3" aria-hidden="true" />
                        Site key
                      </span>
                      <CopyButton value={site.siteKey} label="Copy key" />
                    </div>
                    <code className="mt-2 block break-all font-mono text-[12px] font-medium text-accent-green">
                      {site.siteKey}
                    </code>
                  </div>

                  <div className="rounded-[4px] border border-hairline bg-surface-2 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
                        Embed snippet
                      </span>
                      <CopyButton value={snippet} label="Copy snippet" />
                    </div>
                    <pre className="scrollbar-thin mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-ink">
                      <code>{snippet}</code>
                    </pre>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="max-w-2xl font-mono text-[11px] leading-relaxed text-ink-muted">
                    Paste before <span className="text-ink">&lt;/head&gt;</span>.
                    The loader fetches the SDK and runs one identification on
                    page load. If the site uses a Content-Security-Policy, allow{' '}
                    <span className="text-ink">{origin}</span> in{' '}
                    <span className="text-ink">script-src</span> and{' '}
                    <span className="text-ink">connect-src</span>.
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
