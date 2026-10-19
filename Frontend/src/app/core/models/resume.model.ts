/**
 * Raw resume document shape returned by the ResumeIQ API (GET /resume).
 * Field names mirror the MongoDB "resumes" collection.
 */

export interface ResumeDuration {
  from: string;
  to: string;
}

export interface ResumeWorkExperience {
  company: string;
  designation: string;
  duration: ResumeDuration;
  work_summary: string;
}

export interface ResumeScoreBreakdown {
  content_quality: number;
  experience_impact: number;
  skills_relevance: number;
  structure_clarity: number;
  projects_education_certifications: number;
  professionalism_consistency: number;
  completeness: number;
}

export interface ResumeAtsScoreBreakdown {
  structure: number;
  keyword_terminology: number;
  experience_skills_parsability: number;
  formatting_consistency: number;
  content_organization: number;
  contact_parsability: number;
  date_consistency: number;
}

export interface ResumeAnalysisPayload {
  name: string;
  email: string;
  pno: string;
  summary: string;
  college: string;
  degree: string;
  work_experience?: ResumeWorkExperience[];
  skills?: Record<string, string[]>;
  overall_score: number;
  score_breakdown?: ResumeScoreBreakdown;
  score_summary: string;
  strengths?: string[];
  improvements?: string[];
  ats_score: number;
  ats_score_breakdown?: ResumeAtsScoreBreakdown;
  ats_summary: string;
  ats_strengths?: string[];
  ats_improvements?: string[];
}

export interface ResumeRecord {
  _id: string;
  uploaded_at: string;
  processed_at?: string | null;
  file_name: string;
  user_id: string;
  /** S3 object key for the uploaded file. */
  s3_key?: string;
  /** Null or absent while the resume has not been analysed yet. */
  analysis?: ResumeAnalysisPayload | null;
}
