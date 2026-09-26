export type PlanId = 'free' | 'premium';

/**
 * Every tracked usage counter. Resume slots (storage) are intentionally a
 * separate concept from the monthly AI operations.
 */
export type UsageKind =
  | 'resumeSlots'
  | 'resumeAnalyses'
  | 'jobMatches'
  | 'resumeQuestions'
  | 'interviewSessions';

export interface UsageEntry {
  used: number;
  limit: number;
}

export type UsageMap = Record<UsageKind, UsageEntry>;

export interface BillingPeriod {
  start: string;
  end: string;
}

export interface SubscriptionState {
  planId: PlanId;
  planLabel: string;
  premium: boolean;
  usage: UsageMap;
  billingPeriod: BillingPeriod;
  loading: boolean;
  error: string | null;
}

export type AccessLevel = 'none' | 'basic' | 'limited' | 'full';

/** Result of an (eventually remote) subscription change flow. */
export interface SubscriptionChangeResult {
  ok: boolean;
  planId: PlanId;
  mock?: boolean;
  message?: string;
}