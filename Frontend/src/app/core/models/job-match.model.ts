export interface JobMatchJob {
  title: string;
  seniority: string;
  summary: string;
}

export interface JobMatchScoreCategory {
  score: number;
  maxScore: number;
}

export interface JobMatchScoreBreakdown {
  requiredSkills: JobMatchScoreCategory;
  responsibilities: JobMatchScoreCategory;
  experience: JobMatchScoreCategory;
  preferredQualifications: JobMatchScoreCategory;
  projectsDomainRelevance: JobMatchScoreCategory;
  educationCertifications: JobMatchScoreCategory;
  keywordAlignment: JobMatchScoreCategory;
}

/** A matched or partially matched skill (partial items add a `gap`). */
export interface JobMatchSkill {
  skill: string;
  matchType: string;
  importance: string;
  resumeEvidence: string;
  gap?: string;
}

export interface JobMatchMissingSkill {
  skill: string;
  importance: string;
  reason: string;
}

export interface JobMatchSkills {
  matched: JobMatchSkill[];
  partial: JobMatchSkill[];
  missing: JobMatchMissingSkill[];
}

export interface JobMatchMatchedResponsibility {
  responsibility: string;
  resumeEvidence: string;
  matchStrength: string;
}

export interface JobMatchPartialResponsibility {
  responsibility: string;
  resumeEvidence: string;
  gap?: string;
}

export interface JobMatchMissingResponsibility {
  responsibility: string;
  importance: string;
}

export interface JobMatchResponsibilities {
  matched: JobMatchMatchedResponsibility[];
  partial: JobMatchPartialResponsibility[];
  missing: JobMatchMissingResponsibility[];
}

export interface JobMatchExperience {
  requiredExperience: string;
  resumeExperienceEvidence: string;
  status: string;
  details: string;
}

export interface JobMatchEducation {
  status: string;
  matchedRequirements: string[];
  missingRequirements: string[];
}

export interface JobMatchCertifications {
  matched: string[];
  missing: string[];
}

export interface JobMatchProject {
  projectName: string;
  relevance: string;
  matchedRequirements: string[];
  resumeEvidence: string;
}

export interface JobMatchKeywordAnalysis {
  exactMatches: string[];
  semanticMatches: string[];
  missingImportantKeywords: string[];
}

export interface JobMatchRequirement {
  requirement: string;
  category: string;
  priority: string;
  matchStatus: string;
  matchType: string;
  importance: number;
  resumeEvidence: string;
  reason: string;
}

export interface JobMatch {
  /** Document id (backend `_id`) used in the detail route. */
  id: string;
  /** Display date derived from the match's created_at timestamp. */
  analyzedAt?: string;
  matchScore: number;
  matchLabel: string;
  job: JobMatchJob;
  /** Resume this match was run against (null when it no longer exists). */
  resume: JobMatchResumeRef | null;
  scoreBreakdown: JobMatchScoreBreakdown;
  skills: JobMatchSkills;
  responsibilities: JobMatchResponsibilities;
  experience: JobMatchExperience;
  education: JobMatchEducation;
  certifications: JobMatchCertifications;
  projects: JobMatchProject[];
  keywordAnalysis: JobMatchKeywordAnalysis;
  requirementAnalysis: JobMatchRequirement[];
  strengths: string[];
  criticalGaps: string[];
  improvements: string[];
}

/**
 * Card view model for the job match history list (GET /job-match): the
 * summary fields shown on each card.
 */
export interface JobMatchSummary {
  id: string;
  analyzedAt?: string;
  matchScore: number;
  matchLabel: string;
  job: JobMatchJob;
  /** Resume this match was run against (null when it no longer exists). */
  resume: JobMatchResumeRef | null;
}

/**
 * Reference to the resume a job match was analyzed against. The API joins the
 * `resume_id` stored on the job match with the "resumes" collection.
 */
export interface JobMatchResumeRef {
  id: string;
  fileName: string;
}

/**
 * Raw job match document shapes returned by the ResumeIQ API. Field names
 * mirror the MongoDB "job_matches" collection.
 */

export interface JobMatchScoreCategoryPayload {
  score: number;
  max_score: number;
}

export interface JobMatchScoreBreakdownPayload {
  required_skills: JobMatchScoreCategoryPayload;
  responsibilities: JobMatchScoreCategoryPayload;
  experience: JobMatchScoreCategoryPayload;
  preferred_qualifications: JobMatchScoreCategoryPayload;
  projects_domain_relevance: JobMatchScoreCategoryPayload;
  education_certifications: JobMatchScoreCategoryPayload;
  keyword_alignment: JobMatchScoreCategoryPayload;
}

/** A matched or partially matched skill (partial items add a `gap`). */
export interface JobMatchMatchedSkillPayload {
  skill: string;
  match_type: string;
  importance: string;
  resume_evidence: string;
  gap?: string;
}

export interface JobMatchMissingSkillPayload {
  skill: string;
  importance: string;
  reason: string;
}

export interface JobMatchSkillsPayload {
  matched: JobMatchMatchedSkillPayload[];
  partial: JobMatchMatchedSkillPayload[];
  missing: JobMatchMissingSkillPayload[];
}

export interface JobMatchResponsibilitiesPayload {
  matched: {
    responsibility: string;
    resume_evidence: string;
    match_strength: string;
  }[];
  partial: {
    responsibility: string;
    resume_evidence: string;
    gap?: string;
  }[];
  missing: {
    responsibility: string;
    importance: string;
  }[];
}

export interface JobMatchExperiencePayload {
  required_experience: string;
  resume_experience_evidence: string;
  status: string;
  details: string;
}

export interface JobMatchEducationPayload {
  status: string;
  matched_requirements: string[];
  missing_requirements: string[];
}

export interface JobMatchCertificationsPayload {
  matched: string[];
  missing: string[];
}

export interface JobMatchProjectPayload {
  project_name: string;
  relevance: string;
  matched_requirements: string[];
  resume_evidence: string;
}

export interface JobMatchKeywordAnalysisPayload {
  exact_matches: string[];
  semantic_matches: string[];
  missing_important_keywords: string[];
}

export interface JobMatchRequirementPayload {
  requirement: string;
  category: string;
  priority: string;
  match_status: string;
  match_type: string;
  importance: number;
  resume_evidence: string;
  reason: string;
}

/** The analysis payload stored on every job match document. */
export interface JobMatchAnalysisPayload {
  match_score: number;
  match_label: string;
  job: JobMatchJob;
  score_breakdown: JobMatchScoreBreakdownPayload;
  skills: JobMatchSkillsPayload;
  responsibilities: JobMatchResponsibilitiesPayload;
  experience: JobMatchExperiencePayload;
  education: JobMatchEducationPayload;
  certifications: JobMatchCertificationsPayload;
  projects: JobMatchProjectPayload[];
  keyword_analysis: JobMatchKeywordAnalysisPayload;
  requirement_analysis: JobMatchRequirementPayload[];
  strengths?: string[];
  critical_gaps?: string[];
  improvements?: string[];
}

/**
 * List record returned by GET /job-match. Only the summary fields the history
 * cards need are selected; the full analysis is fetched per match.
 */
export interface JobMatchListRecord {
  _id: string;
  resume_id: string;
  created_at: string;
  analysis: Pick<JobMatchAnalysisPayload, 'match_score' | 'match_label' | 'job'>;
  /** Joined from the "resumes" collection (null when the resume is gone). */
  resume?: JobMatchResumePayload | null;
}

/** Resume reference embedded in job match API responses. */
export interface JobMatchResumePayload {
  id: string;
  file_name: string;
}

/** Full document returned by GET /job-match/:id. */
export interface JobMatchRecord {
  _id: string;
  job_description: string;
  user_id: string;
  resume_id: string;
  analysis: JobMatchAnalysisPayload;
  created_at: string;
  updated_at: string;
  /** Joined from the "resumes" collection (null when the resume is gone). */
  resume?: JobMatchResumePayload | null;
}