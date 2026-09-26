export interface ResumeStatus {
  fileName: string;
  lastAnalyzed: string;
  overallScore: number;
  atsScore: number;
}

export type StatTone = 'accent' | 'success' | 'warn' | 'info';

export interface Stat {
  id: string;
  label: string;
  value: string;
  sub: string;
  icon: string;
  tone: StatTone;
  progress?: number;
}

export interface Insight {
  id: string;
  icon: string;
  category: string;
  title: string;
  description: string;
}

export interface ActivityItem {
  icon: string;
  text: string;
  detail: string;
}

export interface ActivityGroup {
  date: string;
  items: ActivityItem[];
}

export interface SkillGroup {
  group: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  points: string[];
}

export interface ProjectItem {
  name: string;
  stack: string[];
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface ScoreBreakdown {
  contentQuality: number;
  experienceImpact: number;
  skillsRelevance: number;
  structureClarity: number;
  projectsEducationCertifications: number;
  professionalismConsistency: number;
  completeness: number;
}

export interface AtsScoreBreakdown {
  structure: number;
  keywordTerminology: number;
  experienceSkillsParsability: number;
  formattingConsistency: number;
  contentOrganization: number;
  contactParsability: number;
  dateConsistency: number;
}

export interface ResumeAnalysis {
  fileName: string;
  overallScore: number;
  atsScore: number;
  summary: string;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  scoreBreakdown: ScoreBreakdown;
  scoreSummary: string;
  strengths: string[];
  improvements: string[];
  atsScoreBreakdown: AtsScoreBreakdown;
  atsSummary: string;
  atsStrengths: string[];
  atsImprovements: string[];
}

export interface JobMatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  relevantExperience: string[];
  recommendations: string[];
}

export interface SkillGap {
  skill: string;
  level: number;
  note: string;
}

export interface SkillGapData {
  yourSkills: string[];
  targetSkills: string[];
  gaps: SkillGap[];
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  targetRole: string;
  experienceLevel: string;
  technologies: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

export interface InterviewQuestion {
  prompt: string;
  followUp: string;
}

export interface InterviewEvaluation {
  strengths: string[];
  weaknesses: string[];
  suggestedAnswer: string;
  followUp: string;
}

export interface ImprovementPair {
  current: string;
  suggested: string;
}

export interface ImprovementData {
  summary: ImprovementPair;
  experience: ImprovementPair[];
  projects: ImprovementPair[];
  skills: ImprovementPair;
}