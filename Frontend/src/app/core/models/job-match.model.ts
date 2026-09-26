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
  /** Frontend route identifier (not part of the backend payload). */
  id: string;
  /** Optional display date for the history card (frontend/mock only). */
  analyzedAt?: string;
  matchScore: number;
  matchLabel: string;
  job: JobMatchJob;
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