import { PlanId, UsageKind } from '../models/subscription.model';
import { FEATURE_IDS, FeatureId } from './feature-ids';

/**
 * Central source of truth for ResumeIQ plans and limits.
 *
 * Keep usage values here instead of scattering them through components. Adding
 * a future plan (e.g. Pro) only requires a new entry in PLANS plus any new
 * usage counters in the UsageKind union.
 */

export interface PlanConfig {
  id: PlanId;
  name: string;
  /** User-facing label, e.g. "ResumeIQ Free". */
  planLabel: string;
  /** Monthly price in INR, or null when not published yet. */
  price: number | null;
  /** Display string for the price area. */
  priceLabel: string;
  tagline: string;
  monthlyLimits: Record<UsageKind, number>;
  resumeImprovement: 'limited' | 'full';
  skillGapAnalysis: 'basic' | 'full';
  advancedFeatures: boolean;
  careerAgent: 'none' | 'comingSoon';
}

export const FREE_PLAN_ID: PlanId = 'free';
export const PREMIUM_PLAN_ID: PlanId = 'premium';

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    planLabel: 'ResumeIQ Free',
    price: 0,
    priceLabel: 'Free',
    tagline: 'Everything you need to get started with your resume.',
    monthlyLimits: {
      resumeSlots: 3,
      resumeAnalyses: 3,
      jobMatches: 3,
      resumeQuestions: 20,
      interviewSessions: 1,
    },
    resumeImprovement: 'limited',
    skillGapAnalysis: 'basic',
    advancedFeatures: false,
    careerAgent: 'none',
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    planLabel: 'ResumeIQ Premium',
    price: null,
    priceLabel: 'Coming Soon',
    tagline: 'More AI usage, deeper insights and advanced career preparation.',
    monthlyLimits: {
      resumeSlots: 20,
      resumeAnalyses: 30,
      jobMatches: 30,
      resumeQuestions: 300,
      interviewSessions: 10,
    },
    resumeImprovement: 'full',
    skillGapAnalysis: 'full',
    advancedFeatures: true,
    careerAgent: 'comingSoon',
  },
};

export const FREE_PLAN = PLANS.free;
export const PREMIUM_PLAN = PLANS.premium;

/** Human-readable labels for each usage counter. */
export const USAGE_LABELS: Record<
  UsageKind,
  { name: string; unit: string; unitSingular: string; short: string }
> = {
  resumeSlots: { name: 'Resume storage', unit: 'resume slots', unitSingular: 'resume slot', short: 'resumes' },
  resumeAnalyses: { name: 'AI resume analysis', unit: 'AI analyses', unitSingular: 'AI analysis', short: 'analyses' },
  jobMatches: { name: 'Job matching', unit: 'Job Matches', unitSingular: 'Job Match', short: 'matches' },
  resumeQuestions: { name: 'Resume Q&A', unit: 'questions', unitSingular: 'question', short: 'questions' },
  interviewSessions: { name: 'Interview preparation', unit: 'interview sessions', unitSingular: 'interview session', short: 'sessions' },
};

/** Maps a feature to the usage counter that gates it (where applicable). */
export const FEATURE_USAGE_KIND: Partial<Record<FeatureId, UsageKind>> = {
  [FEATURE_IDS.RESUME_STORAGE]: 'resumeSlots',
  [FEATURE_IDS.RESUME_ANALYSIS]: 'resumeAnalyses',
  [FEATURE_IDS.JOB_MATCH]: 'jobMatches',
  [FEATURE_IDS.RESUME_QA]: 'resumeQuestions',
  [FEATURE_IDS.INTERVIEW_PREP]: 'interviewSessions',
};

/** Short, user-facing feature label per feature id. */
export const FEATURE_LABELS: Record<FeatureId, string> = {
  [FEATURE_IDS.RESUME_STORAGE]: 'Resume storage',
  [FEATURE_IDS.RESUME_ANALYSIS]: 'Resume Analysis',
  [FEATURE_IDS.JOB_MATCH]: 'Job Match',
  [FEATURE_IDS.RESUME_QA]: 'Resume Q&A',
  [FEATURE_IDS.INTERVIEW_PREP]: 'Interview Preparation',
  [FEATURE_IDS.RESUME_IMPROVEMENT]: 'Resume Improvement',
  [FEATURE_IDS.SKILL_GAP_ANALYSIS]: 'Skill Gap Analysis',
  [FEATURE_IDS.CAREER_AGENT]: 'AI Career Assistant',
};

/** Comparison table copy (Free vs Premium), used by the upgrade page. */
export interface PlanComparisonRow {
  label: string;
  free: string;
  premium: string;
  premiumBadge?: 'included' | 'comingSoon';
}

export const PLAN_COMPARISON: PlanComparisonRow[] = [
  { label: 'Resume slots', free: '3', premium: '20' },
  { label: 'Resume analyses', free: '3 / month', premium: '30 / month' },
  { label: 'Job matches', free: '3 / month', premium: '30 / month' },
  { label: 'Resume Q&A', free: '20 / month', premium: '300 / month' },
  { label: 'Interview sessions', free: '1 / month', premium: '10 / month' },
  { label: 'Resume improvement', free: 'Limited', premium: 'Full' },
  { label: 'Skill gap analysis', free: 'Basic', premium: 'Full' },
  { label: 'Advanced features', free: '—', premium: 'Included', premiumBadge: 'included' },
  { label: 'AI Career Assistant', free: '—', premium: 'Coming Soon', premiumBadge: 'comingSoon' },
];