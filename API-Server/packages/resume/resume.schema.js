const mongoose = require('mongoose');

/**
 * Sub-schema for the analysis result embedded inside a resume document.
 * A resume may exist without an analysis (analysis === null), in which case
 * the frontend shows the "Analyse" button instead of "Analysed".
 */
const AnalysisSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    pno: { type: String, default: '' },
    summary: { type: String, default: '' },
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    work_experience: [
      {
        company: { type: String, default: '' },
        designation: { type: String, default: '' },
        duration: {
          from: { type: String, default: '' },
          to: { type: String, default: '' },
        },
        work_summary: { type: String, default: '' },
      },
    ],
    skills: Object,
    overall_score: { type: Number, default: 0 },
    score_breakdown: {
      content_quality: { type: Number, default: 0 },
      experience_impact: { type: Number, default: 0 },
      skills_relevance: { type: Number, default: 0 },
      structure_clarity: { type: Number, default: 0 },
      projects_education_certifications: { type: Number, default: 0 },
      professionalism_consistency: { type: Number, default: 0 },
      completeness: { type: Number, default: 0 },
    },
    score_summary: { type: String, default: '' },
    strengths: [{ type: String, default: '' }],
    improvements: [{ type: String, default: '' }],
    ats_score: { type: Number, default: 0 },
    ats_score_breakdown: {
      structure: { type: Number, default: 0 },
      keyword_terminology: { type: Number, default: 0 },
      experience_skills_parsability: { type: Number, default: 0 },
      formatting_consistency: { type: Number, default: 0 },
      content_organization: { type: Number, default: 0 },
      contact_parsability: { type: Number, default: 0 },
      date_consistency: { type: Number, default: 0 },
    },
    ats_summary: { type: String, default: '' },
    ats_strengths: [{ type: String, default: '' }],
    ats_improvements: [{ type: String, default: '' }],
  },
  { _id: false, versionKey: false },
);

const ResumeSchema = new mongoose.Schema(
  {
    uploaded_at: { type: Date },
    processed_at: { type: Date },
    file_name: { type: String, required: true },
    user_id: { type: String, required: true },
    s3_key: { type: String, unique: true, sparse: true, index: true },
    analysis: { type: AnalysisSchema, default: null },
  },
  {
    collection: 'resumes',
    // The collection manages uploaded_at / processed_at explicitly, so disable
    // mongoose's automatic created_at / updated_at timestamps.
    timestamps: false,
    versionKey: false,
  },
);

module.exports = ResumeSchema;
