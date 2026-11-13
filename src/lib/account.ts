import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ENGINE_URL =
  process.env.RUST_BACKEND_INTERNAL_URL ?? 'http://127.0.0.1:8080';

export const SESSION_COOKIE = 'es_session';
const INTERNAL_SECRET = process.env.EVENSTAMP_INTERNAL_SECRET ?? '';

export interface AccountUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  picture: string;
  createdAtMs: number;
}

export interface PlanSummary {
  key: string;
  name: string;
  interval: 'monthly' | 'annual';
  status: string;
  provider: 'none' | 'airwallex' | 'nowpayments';
  included: number | null;
  currentPeriodEndMs: number | null;
}

export interface UsageSummary {
  month: string;
  identifications: number;
  included: number | null;
  overageUnits: number;
  overageCents: number;
  plan: string;
}

export interface MeResponse {
  user: AccountUser;
  plan: PlanSummary;
  effectivePlan: string;
  usage: UsageSummary;
}

export interface SiteSummary {
  siteId: string;
  name: string;
  domain: string;
  siteKey: string;
  createdAtMs: number;
  sessions30d: number;
  lastSessionAt: number | null;
}

export interface Finding {
  code: string;
  score: number;
}

export interface EdgeTelemetry {
  country?: string | null;
  countryName?: string | null;
  city?: string | null;
  region?: string | null;
  asn?: number | null;
  asOrganization?: string | null;
  tcpTtl?: number | null;
  tcpMss?: number | null;
  tcpRttMs?: number | null;
  tlsRttMs?: number | null;
  ja4Fingerprint?: string | null;
  ipPrefix?: string | null;
}

export interface BehaviorSummary {
  pointerEventCount?: number;
  keyEventCount?: number;
  scrollEventCount?: number;
  meanVelocity?: number;
  p90Jerk?: number;
  pathStraightnessRatio?: number;
  meanDwellMs?: number;
  rolloverRatio?: number;
}

export interface SessionSummary {
  sessionId: string;
  siteId: string | null;
  siteName: string;
  browserId: string;
  deviceId: string;
  confidenceScore: number;
  riskScore: number;
  spoofAndAutomationScore: number;
  privacyToolDetected: boolean;
  isNewDevice: boolean;
  anomalies: string[];
  findings: Finding[];
  behavior: BehaviorSummary;
  edge: EdgeTelemetry;
  createdAt: number;
  gpuRenderer?: string | null;
  osFamily?: string | null;
}

export interface SessionList {
  sessions: SessionSummary[];
  hasMore: boolean;
  nextBefore: number | null;
}

export interface DeviceDetail {
  gpuVendor: string;
  gpuRenderer: string;
  gpuLimitsHash: string;
  osFamily: string;
  screenWidth: number;
  screenHeight: number;
  cores: number;
  mathInvariantsHash: string;
  lastAsn: number | null;
  lastIpPrefix: string | null;
  firstSeenAt: number;
  lastSeenAt: number;
}

export interface SessionDetailResponse {
  session: SessionSummary & { rawPayload: unknown | null };
  device: DeviceDetail | null;
}

export interface BillingPlan {
  key: string;
  name: string;
  monthlyCents: number;
  annualCents: number;
  included: number | null;
  overagePer10kCents: number;
  retentionDays: number;
}

export interface BillingResponse {
  plan: PlanSummary;
  effectivePlan: string;
  usage: UsageSummary;
  providers: {
    airwallex: boolean;
    airwallexWebhooks: boolean;
    /** `plan:interval` -> whether the recurring Airwallex price id is set. */
    airwallexPrices: Record<string, boolean>;
    nowpayments: boolean;
    nowpaymentsWebhooks: boolean;
  };
  plans: BillingPlan[];
}

export interface CheckoutResponse {
  checkoutId: string;
  provider: string;
  url: string;
}

export class AccountApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'AccountApiError';
    this.status = status;
    this.code = code;
  }
}

interface AccountFetchOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  token?: string | null;
  body?: unknown;
}

export async function accountFetch<T>(
  path: string,
  options: AccountFetchOptions = {},
): Promise<T> {
  const headers = new Headers({ accept: 'application/json' });
  if (INTERNAL_SECRET) {
    headers.set('x-evenstamp-internal-secret', INTERNAL_SECRET);
  }
  if (options.token) {
    headers.set('x-evenstamp-session', options.token);
  }
  if (options.body !== undefined) {
    headers.set('content-type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${ENGINE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: 'no-store',
    });
  } catch {
    throw new AccountApiError(
      502,
      'ENGINE_UNREACHABLE',
      'Evenstamp engine is unreachable from the web app',
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = (payload as { error?: { code?: string; message?: string } })
      ?.error;
    throw new AccountApiError(
      response.status,
      error?.code ?? `HTTP_${response.status}`,
      error?.message ?? `Evenstamp account API returned ${response.status}`,
    );
  }

  return payload as T;
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export const getMe = cache(async (): Promise<MeResponse | null> => {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await accountFetch<MeResponse>('/api/v1/account/me', { token });
  } catch (error) {
    if (error instanceof AccountApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
});

export async function requireUser(
  nextPath = '/dashboard',
): Promise<MeResponse> {
  const me = await getMe();
  if (!me) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return me;
}

export async function getSites(): Promise<SiteSummary[]> {
  const token = await getSessionToken();
  if (!token) return [];
  const response = await accountFetch<{ sites: SiteSummary[] }>(
    '/api/v1/account/sites',
    { token },
  );
  return response.sites;
}

export async function getSessions(params: {
  siteId?: string;
  risk?: string;
  before?: number;
  limit?: number;
}): Promise<SessionList> {
  const token = await getSessionToken();
  if (!token) {
    return { sessions: [], hasMore: false, nextBefore: null };
  }
  const search = new URLSearchParams();
  if (params.siteId) search.set('siteId', params.siteId);
  if (params.risk && params.risk !== 'all') search.set('risk', params.risk);
  if (params.before) search.set('before', String(params.before));
  if (params.limit) search.set('limit', String(params.limit));
  const query = search.size > 0 ? `?${search.toString()}` : '';
  return accountFetch<SessionList>(`/api/v1/account/sessions${query}`, {
    token,
  });
}

export async function getSessionDetail(
  sessionId: string,
): Promise<SessionDetailResponse | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await accountFetch<SessionDetailResponse>(
      `/api/v1/account/sessions/${encodeURIComponent(sessionId)}`,
      { token },
    );
  } catch (error) {
    if (error instanceof AccountApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getBilling(): Promise<BillingResponse> {
  const token = await getSessionToken();
  if (!token) {
    throw new AccountApiError(401, 'SESSION_REQUIRED', 'sign in to continue');
  }
  return accountFetch<BillingResponse>('/api/v1/account/billing', { token });
}
