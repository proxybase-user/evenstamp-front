'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  AccountApiError,
  accountFetch,
  getSessionToken,
  type CheckoutResponse,
} from '@/lib/account';

export interface SiteActionState {
  error?: string;
  ok?: boolean;
}

export interface CheckoutActionState {
  error?: string;
}

async function requireToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect('/login?next=/dashboard');
  }
  return token;
}

function errorMessage(error: unknown): string {
  if (error instanceof AccountApiError) {
    return error.message;
  }
  return 'The engine could not complete that request.';
}

export async function createSiteAction(
  _previous: SiteActionState,
  formData: FormData,
): Promise<SiteActionState> {
  const token = await requireToken();
  const name = String(formData.get('name') ?? '').trim();
  const domain = String(formData.get('domain') ?? '').trim();

  if (!name || !domain) {
    return { error: 'Enter a site name and a domain.' };
  }

  try {
    await accountFetch('/api/v1/account/sites', {
      method: 'POST',
      token,
      body: { name, domain },
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/sites');
  return { ok: true };
}

export async function deleteSiteAction(formData: FormData): Promise<void> {
  const token = await requireToken();
  const siteId = String(formData.get('siteId') ?? '').trim();
  if (!siteId) return;

  try {
    await accountFetch(
      `/api/v1/account/sites/${encodeURIComponent(siteId)}`,
      { method: 'DELETE', token },
    );
  } catch (error) {
    if (error instanceof AccountApiError && error.status === 404) {
      revalidatePath('/dashboard/sites');
      return;
    }
    throw error;
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/sites');
  revalidatePath('/dashboard/sessions');
}

export async function startCheckoutAction(
  _previous: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const token = await requireToken();
  const plan = String(formData.get('plan') ?? '');
  const interval = String(formData.get('interval') ?? 'monthly');
  const provider = String(formData.get('provider') ?? '');

  let checkout: CheckoutResponse;
  try {
    checkout = await accountFetch<CheckoutResponse>(
      '/api/v1/account/billing/checkout',
      {
        method: 'POST',
        token,
        body: { plan, interval, provider },
      },
    );
  } catch (error) {
    return { error: errorMessage(error) };
  }

  redirect(checkout.url);
}
