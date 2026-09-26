import { PLANS } from '../constants/plan.config';
import {
  BillingPeriod,
  SubscriptionState,
  UsageMap,
} from '../models/subscription.model';

/**
 * Development-only mock subscription/usage data.
 *
 * Flip SUBSCRIPTION_MOCK_MODE to preview different states (free / premium /
 * limit reached / empty). This whole module is meant to be replaced by real
 * subscription/usage API responses — the UI only consumes SubscriptionService,
 * which reads from this data source.
 */
export type MockSubscriptionMode = 'free' | 'premium' | 'limitReached' | 'empty';

/** Developer switch. Change this value to preview a scenario. */
export const SUBSCRIPTION_MOCK_MODE: MockSubscriptionMode = 'free';

export function mockBillingPeriod(): BillingPeriod {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function buildMockUsage(mode: MockSubscriptionMode): UsageMap {
  switch (mode) {
    case 'premium':
      return {
        resumeSlots: { used: 7, limit: PLANS.premium.monthlyLimits.resumeSlots },
        resumeAnalyses: { used: 6, limit: PLANS.premium.monthlyLimits.resumeAnalyses },
        jobMatches: { used: 5, limit: PLANS.premium.monthlyLimits.jobMatches },
        resumeQuestions: { used: 40, limit: PLANS.premium.monthlyLimits.resumeQuestions },
        interviewSessions: { used: 2, limit: PLANS.premium.monthlyLimits.interviewSessions },
      };
    case 'limitReached':
      return {
        resumeSlots: { used: 3, limit: PLANS.free.monthlyLimits.resumeSlots },
        resumeAnalyses: { used: 3, limit: PLANS.free.monthlyLimits.resumeAnalyses },
        jobMatches: { used: 3, limit: PLANS.free.monthlyLimits.jobMatches },
        resumeQuestions: { used: 20, limit: PLANS.free.monthlyLimits.resumeQuestions },
        interviewSessions: { used: 1, limit: PLANS.free.monthlyLimits.interviewSessions },
      };
    case 'empty':
      return {
        resumeSlots: { used: 0, limit: PLANS.free.monthlyLimits.resumeSlots },
        resumeAnalyses: { used: 0, limit: PLANS.free.monthlyLimits.resumeAnalyses },
        jobMatches: { used: 0, limit: PLANS.free.monthlyLimits.jobMatches },
        resumeQuestions: { used: 0, limit: PLANS.free.monthlyLimits.resumeQuestions },
        interviewSessions: { used: 0, limit: PLANS.free.monthlyLimits.interviewSessions },
      };
    case 'free':
    default:
      return {
        resumeSlots: { used: 2, limit: PLANS.free.monthlyLimits.resumeSlots },
        resumeAnalyses: { used: 1, limit: PLANS.free.monthlyLimits.resumeAnalyses },
        jobMatches: { used: 2, limit: PLANS.free.monthlyLimits.jobMatches },
        resumeQuestions: { used: 12, limit: PLANS.free.monthlyLimits.resumeQuestions },
        interviewSessions: { used: 0, limit: PLANS.free.monthlyLimits.interviewSessions },
      };
  }
}

export function createMockSubscriptionState(mode: MockSubscriptionMode): SubscriptionState {
  const plan = PLANS[mode === 'premium' ? 'premium' : 'free'];
  return {
    planId: plan.id,
    planLabel: plan.planLabel,
    premium: plan.id === 'premium',
    usage: buildMockUsage(mode),
    billingPeriod: mockBillingPeriod(),
    loading: false,
    error: null,
  };
}