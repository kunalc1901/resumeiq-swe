const mongoose = require('mongoose');

/** One weighted category of the overall match score. */
const ScoreCategorySchema = new mongoose.Schema(
  {
    score: { type: Number, default: 0 },
    max_score: { type: Number, default: 0 },
  },
  { _id: false, versionKey: false },
);

/** A matched or partially matched skill (partial items add a "gap"). */
const SkillMatchSchema = new mongoose.Schema(
  {
    skill: { type: String, default: '' },
    match_type: { type: String, default: '' },
    importance: { type: String, default: '' },
    resume_evidence: { type: String, default: '' },
    gap: { type: String, default: '' },
  },
  { _id: false, versionKey: false },
);

/**
 * Sub-schema for the resume-to-job match analysis embedded inside a job match
 * document. Field names mirror the "job_matches" collection (snake_case).
 */
const AnalysisSchema = new mongoose.Schema(
  {
    match_score: { type: Number, default: 0 },
    match_label: { type: String, default: '' },
    job: {
      title: { type: String, default: '' },
      seniority: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    score_breakdown: {
      required_skills: { type: ScoreCategorySchema, default: () => ({}) },
      responsibilities: { type: ScoreCategorySchema, default: () => ({}) },
      experience: { type: ScoreCategorySchema, default: () => ({}) },
      preferred_qualifications: { type: ScoreCategorySchema, default: () => ({}) },
      projects_domain_relevance: { type: ScoreCategorySchema, default: () => ({}) },
      education_certifications: { type: ScoreCategorySchema, default: () => ({}) },
      keyword_alignment: { type: ScoreCategorySchema, default: () => ({}) },
    },
    skills: {
      matched: { type: [SkillMatchSchema], default: [] },
      partial: { type: [SkillMatchSchema], default: [] },
      missing: [
        {
          skill: { type: String, default: '' },
          importance: { type: String, default: '' },
          reason: { type: String, default: '' },
        },
      ],
    },
    responsibilities: {
      matched: [
        {
          responsibility: { type: String, default: '' },
          resume_evidence: { type: String, default: '' },
          match_strength: { type: String, default: '' },
        },
      ],
      partial: [
        {
          responsibility: { type: String, default: '' },
          resume_evidence: { type: String, default: '' },
          gap: { type: String, default: '' },
        },
      ],
      missing: [
        {
          responsibility: { type: String, default: '' },
          importance: { type: String, default: '' },
        },
      ],
    },
    experience: {
      required_experience: { type: String, default: '' },
      resume_experience_evidence: { type: String, default: '' },
      status: { type: String, default: '' },
      details: { type: String, default: '' },
    },
    education: {
      status: { type: String, default: '' },
      matched_requirements: [{ type: String, default: '' }],
      missing_requirements: [{ type: String, default: '' }],
    },
    certifications: {
      matched: [{ type: String, default: '' }],
      missing: [{ type: String, default: '' }],
    },
    projects: [
      {
        project_name: { type: String, default: '' },
        relevance: { type: String, default: '' },
        matched_requirements: [{ type: String, default: '' }],
        resume_evidence: { type: String, default: '' },
      },
    ],
    keyword_analysis: {
      exact_matches: [{ type: String, default: '' }],
      semantic_matches: [{ type: String, default: '' }],
      missing_important_keywords: [{ type: String, default: '' }],
    },
    requirement_analysis: [
      {
        requirement: { type: String, default: '' },
        category: { type: String, default: '' },
        priority: { type: String, default: '' },
        match_status: { type: String, default: '' },
        match_type: { type: String, default: '' },
        importance: { type: Number, default: 0 },
        resume_evidence: { type: String, default: '' },
        reason: { type: String, default: '' },
      },
    ],
    strengths: [{ type: String, default: '' }],
    critical_gaps: [{ type: String, default: '' }],
    improvements: [{ type: String, default: '' }],
    contradictions: [{ type: String, default: '' }],
    confidence: {
      overall: { type: Number, default: 0 },
      requirement_extraction: { type: Number, default: 0 },
      resume_evidence_coverage: { type: Number, default: 0 },
    },
    limitations: [{ type: String, default: '' }],
  },
  { _id: false, versionKey: false },
);

const JobMatchSchema = new mongoose.Schema(
  {
    job_description: { type: String, default: '' },
    user_id: { type: String, required: true },
    resume_id: { type: String, default: '' },
    analysis: { type: AnalysisSchema, default: null },
    created_at: { type: Date },
    updated_at: { type: Date },
  },
  {
    collection: 'job_matches',
    // The collection manages created_at / updated_at explicitly, so disable
    // mongoose's automatic created_at / updated_at timestamps.
    timestamps: false,
    versionKey: false,
  },
);

module.exports = JobMatchSchema;
