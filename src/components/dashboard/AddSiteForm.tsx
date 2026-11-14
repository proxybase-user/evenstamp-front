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
      className="card-feature !p-6"
    >
      <h2 className="text-base font-semibold text-ink">Add a website</h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-body">
        The name is for your dashboard. The domain documents which origin will
        load the snippet.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink-muted">
            Site name
          </span>
          <input
            name="name"
            required
            maxLength={100}
            placeholder="Production app"
            className="text-input mt-1.5 w-full !text-sm !py-2"
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
            className="text-input mt-1.5 w-full !text-sm !py-2 font-mono"
          />
        </label>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="mt-3.5 rounded-[4px] border border-accent-red/30 bg-accent-red/10 px-3.5 py-2 text-xs text-accent-red"
        >
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="mt-3.5 rounded-[4px] border border-accent-green/30 bg-accent-green/10 px-3.5 py-2 text-xs text-accent-green">
          Site added. Its key and snippet are below.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="button-primary mt-4 !text-xs !py-2 !min-h-0"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        {pending ? 'Creating site…' : 'Create site'}
      </button>
    </form>
  );
}
