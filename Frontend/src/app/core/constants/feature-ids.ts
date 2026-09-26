/**
 * Centralized feature identifiers. Pages and components must reference these
 * constants instead of hardcoding feature names, so feature-access logic stays
 * in one place (see SubscriptionService.canUse / accessOf).
 */
export const FEATURE_IDS = {
  RESUME_STORAGE: 'resumeStorage',
  RESUME_ANALYSIS: 'resumeAnalysis',
  JOB_MATCH: 'jobMatch',
  RESUME_QA: 'resumeQA',
  INTERVIEW_PREP: 'interview',
  RESUME_IMPROVEMENT: 'resumeImprovement',
  SKILL_GAP_ANALYSIS: 'skillGapAnalysis',
  CAREER_AGENT: 'careerAgent',
} as const;

export type FeatureId = (typeof FEATURE_IDS)[keyof typeof FEATURE_IDS];