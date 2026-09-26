import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FEATURE_IDS, FeatureId } from '../constants/feature-ids';
import {
  FEATURE_USAGE_KIND,
  PLANS,
  PlanConfig,
  USAGE_LABELS,
} from '../constants/plan.config';
import {
  createMockSubscriptionState,
  MockSubscriptionMode,
  mockBillingPeriod,
  SUBSCRIPTION_MOCK_MODE,
} from '../mocks/subscription.mock';
import {
  AccessLevel,
  SubscriptionChangeResult,
  SubscriptionState,
  UsageEntry,
  UsageKind,
} from '../models/subscription.model';

/**
 * Data-source mode. 'mock' drives the UI from the development mock;
 * flip to 'api' when the backend subscription/usage endpoints exist.
 */
const SUBSCRIPTION_MODE: 'mock' | 'api' = 'mock';

export type UsageTone = 'normal' | 'close' | 'almost' | 'exhausted';

/** Shared thresholds for low-usage warnings (50%+ normal, 75%+ close, 90%+ almost). */
export function computeUsageTone(used: number, limit: number): UsageTone {
  if (used >= limit) {
    return 'exhausted';
  }
  if (!limit) {
    return 'normal';
  }
  const pct = Math.min(100, Math.round((used / limit) * 100));
  if (pct >= 90) {
    return 'almost';
  }
  if (pct >= 75) {
    return 'close';
  }
  return 'normal';
}

function emptyInitialState(): SubscriptionState {
  const usage: SubscriptionState['usage'] = {
    resumeSlots: { used: 0, limit: PLANS.free.monthlyLimits.resumeSlots },
    resumeAnalyses: { used: 0, limit: PLANS.free.monthlyLimits.resumeAnalyses },
    jobMatches: { used: 0, limit: PLANS.free.monthlyLimits.jobMatches },
    resumeQuestions: { used: 0, limit: PLANS.free.monthlyLimits.resumeQuestions },
    interviewSessions: { used: 0, limit: PLANS.free.monthlyLimits.interviewSessions },
  };
  return {
    planId: PLANS.free.id,
    planLabel: PLANS.free.planLabel,
    premium: false,
    usage,
    billingPeriod: mockBillingPeriod(),
    loading: true,
    error: null,
  };
}

/**
 * Single facade for the authenticated user's subscription + usage state.
 *
 * UI components must go through this service (never read mock values directly),
 * so the mock data-source can be swapped for real APIs without touching the UI.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private stateSubject = new BehaviorSubject<SubscriptionState>(emptyInitialState());
  state$ = this.stateSubject.asObservable();

  private mockMode: MockSubscriptionMode = SUBSCRIPTION_MOCK_MODE;
  private loaded = false;

  get state(): SubscriptionState {
    return this.stateSubject.value;
  }

  isMockMode(): boolean {
    return SUBSCRIPTION_MODE === 'mock';
  }

  /** Load subscription + usage. Safe to call multiple times; loads once. */
  load(): void {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    this.fetchState();
  }

  /** Force a reload (e.g. retry after an error). */
  reload(): void {
    this.loaded = true;
    this.fetchState();
  }

  /** Development helper: switch mock scenario at runtime. */
  setMockMode(mode: MockSubscriptionMode): void {
    this.mockMode = mode;
    this.loaded = true;
    this.fetchState();
  }

  /**
   * Reads subscription + usage. Mock implementation returns the mock snapshot.
   * Backend replacement:
   *   return this.api.get('/subscription').pipe(...)  // plan + usage + billing
   */
  private fetchState(): void {
    const current = this.stateSubject.value;
    this.stateSubject.next({ ...current, loading: true, error: null });

    if (SUBSCRIPTION_MODE === 'api') {
      // TODO: wire real endpoints, e.g.
      //   this.apiService.get('/subscription')
      //   this.apiService.get('/usage')
      this.stateSubject.next({
        ...emptyInitialState(),
        loading: false,
        error: 'Subscription service is not configured yet.',
      });
      return;
    }

    // Mock: short delay so loading/error states are exercised.
    setTimeout(() => {
      this.stateSubject.next({
        ...createMockSubscriptionState(this.mockMode),
        loading: false,
      });
    }, 350);
  }

  getPlan(): PlanConfig {
    return PLANS[this.state.planId];
  }

  isPremium(): boolean {
    return this.state.premium;
  }

  premiumLabel(): string {
    return '✦ Premium';
  }

  usageOf(kind: UsageKind): UsageEntry {
    return this.state.usage[kind];
  }

  remainingOf(kind: UsageKind): number {
    const e = this.state.usage[kind];
    return Math.max(0, e.limit - e.used);
  }

  percentOf(kind: UsageKind): number {
    const e = this.state.usage[kind];
    if (!e.limit) {
      return 100;
    }
    return Math.min(100, Math.round((e.used / e.limit) * 100));
  }

  /** Warning/limit tone for a usage counter (used by progress components). */
  toneOf(kind: UsageKind): UsageTone {
    const e = this.state.usage[kind];
    return computeUsageTone(e.used, e.limit);
  }

  /**
   * Centralized access control. Considers plan gating and remaining usage for
   * the monthly AI counters. Pages must use this instead of duplicating logic.
   */
  canUse(feature: FeatureId): boolean {
    const kind = FEATURE_USAGE_KIND[feature];
    if (kind) {
      return this.remainingOf(kind) > 0;
    }
    // Non-metered features are available to both plans (with different depth).
    return this.accessOf(feature) !== 'none';
  }

  /** Depth of access for non-metered features (improvement, skill gaps...). */
  accessOf(feature: FeatureId): AccessLevel {
    const plan = this.getPlan();
    switch (feature) {
      case FEATURE_IDS.RESUME_IMPROVEMENT:
        return plan.resumeImprovement;
      case FEATURE_IDS.SKILL_GAP_ANALYSIS:
        return plan.skillGapAnalysis;
      case FEATURE_IDS.CAREER_AGENT:
        return 'none'; // not implemented yet
      default:
        return 'full';
    }
  }

  /** Local increment for mock/development usage. Backend becomes authoritative. */
  consume(kind: UsageKind, amount = 1): void {
    const state = this.stateSubject.value;
    const entry = state.usage[kind];
    const next: SubscriptionState = {
      ...state,
      usage: {
        ...state.usage,
        [kind]: {
          ...entry,
          used: Math.min(entry.limit, entry.used + amount),
        },
      },
    };
    this.stateSubject.next(next);
  }

  /** Local decrement for mock/development usage (e.g. deleting a resume frees a slot). */
  restore(kind: UsageKind, amount = 1): void {
    const state = this.stateSubject.value;
    const entry = state.usage[kind];
    const next: SubscriptionState = {
      ...state,
      usage: {
        ...state.usage,
        [kind]: { ...entry, used: Math.max(0, entry.used - amount) },
      },
    };
    this.stateSubject.next(next);
  }

  /** Human label: "2 of 3 resume slots" */
  usageLabel(kind: UsageKind): string {
    const e = this.state.usage[kind];
    return `${e.used} of ${e.limit} ${USAGE_LABELS[kind].unit}`;
  }

  /** Human label: "2 AI analyses left" / "No analyses left" */
  remainingLabel(kind: UsageKind): string {
    const remaining = this.remainingOf(kind);
    const label = USAGE_LABELS[kind];
    const unit = remaining === 1 ? label.unitSingular : label.unit;
    return remaining === 0
      ? `No ${unit} left`
      : `${remaining} ${unit} left`;
  }

  /** Human label: "1 Job Match left" style with a custom unit. */
  remainingOfKindLabel(kind: UsageKind): string {
    return this.remainingLabel(kind);
  }

  daysUntilReset(): number {
    const end = new Date(this.state.billingPeriod.end);
    return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
  }

  /** Formatted reset date, e.g. "September 30, 2026". */
  resetDateLabel(): string {
    const fmt = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return fmt.format(new Date(this.state.billingPeriod.end));
  }

  resetLabel(): string {
    const days = this.daysUntilReset();
    if (days === 0) {
      return 'Usage resets today';
    }
    return days === 1
      ? 'Usage resets in 1 day'
      : `Usage resets in ${days} days`;
  }

  billingPeriodLabel(): string {
    const { start, end } = this.state.billingPeriod;
    const fmt = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
    });
    const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
      new Date(end),
    );
    return `${fmt.format(new Date(start))} – ${fmt.format(new Date(end))}, ${year}`;
  }

  /**
   * Subscription change flow (Upgrade to Premium).
   *
   * In mock mode this simulates the checkout outcome so the premium UI can be
   * developed. In API mode this would call POST /subscription/checkout and wait
   * for the webhook to flip the subscription. The UI never fabricates a
   * successful payment — it only reflects the state this service returns.
   */
  upgrade(): Observable<SubscriptionChangeResult> {
    const current = this.stateSubject.value;

    if (!this.isMockMode()) {
      return of({
        ok: false,
        planId: current.planId,
        message: 'Premium checkout is coming soon.',
      });
    }

    this.stateSubject.next({ ...current, loading: true });
    return of<SubscriptionChangeResult>({
      ok: true,
      planId: 'premium',
      mock: true,
    }).pipe(
      delay(700),
      map((res) => {
        const premiumState = createMockSubscriptionState('premium');
        this.stateSubject.next({
          ...premiumState,
          loading: false,
        });
        return res;
      }),
    );
  }
}