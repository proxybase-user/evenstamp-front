'use client';

import { Plus } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
import {
  createSiteAction,
  type SiteActionState,
} from '@/app/dashboard/actions';

const INITIAL: SiteActionState = {};

export default function AddSiteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createSiteAction,
    INITIAL,
  );

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="surface-card rounded-xl p-5"
    >
      <h2 className="text-sm font-semibold">Add a website</h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        The name is for your dashboard. The domain documents which origin will
        load the snippet.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
            Site name
          </span>
          <input
            name="name"
            required
            maxLength={100}
            placeholder="Production app"
            className="mt-1.5 w-full rounded-md border border-white/10 bg-canvas px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:border-emerald-500/50 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
            Domain
          </span>
          <input
            name="domain"
            required
            maxLength={253}
            placeholder="app.example.com"
            autoCapitalize="none"
            spellCheck={false}
            className="mt-1.5 w-full rounded-md border border-white/10 bg-canvas px-3 py-2 font-mono text-sm text-ink-primary placeholder:text-ink-muted focus:border-emerald-500/50 focus:outline-none"
          />
        </label>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="mt-3 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"
        >
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="mt-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          Site added. Its key and snippet are below.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        {pending ? 'Creating site…' : 'Create site'}
      </button>
    </form>
  );
}
