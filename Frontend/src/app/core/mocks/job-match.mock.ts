import { JobMatch } from '../models/job-match.model';

/**
 * Mock Job Match data for development.
 *
 * Replace with real API responses via JobMatchService once the backend
 * job-match history/detail endpoints exist.
 */

export const MOCK_JOB_MATCH: JobMatch = {
  id: 'match-1',
  analyzedAt: 'Today',
  matchScore: 69,
  matchLabel: 'Moderate Alignment',
  job: {
    title: 'Software Engineer',
    seniority: 'Mid-Level',
    summary:
      'Design and develop front-end UI/UX and back-end services for the Hire2Retire SaaS platform, handling full lifecycle development using MEAN stack, Linux, relational databases, and cloud technologies.',
  },
  scoreBreakdown: {
    requiredSkills: { score: 17, maxScore: 25 },
    responsibilities: { score: 20, maxScore: 25 },
    experience: { score: 12, maxScore: 20 },
    preferredQualifications: { score: 4, maxScore: 10 },
    projectsDomainRelevance: { score: 8, maxScore: 10 },
    educationCertifications: { score: 4, maxScore: 5 },
    keywordAlignment: { score: 4, maxScore: 5 },
  },
  skills: {
    matched: [
      {
        skill: 'JavaScript',
        matchType: 'EXACT',
        importance: 'HIGH',
        resumeEvidence: 'Listed under Languages and used in SQUARY AI Chatbot.',
      },
      {
        skill: 'TypeScript',
        matchType: 'EXACT',
        importance: 'HIGH',
        resumeEvidence: 'Explicitly listed under Languages.',
      },
      {
        skill: 'Angular',
        matchType: 'EXACT',
        importance: 'HIGH',
        resumeEvidence: 'Listed under Frameworks & Libraries and used in SQUARY AI and DQE projects.',
      },
      {
        skill: 'Node.js',
        matchType: 'EXACT',
        importance: 'HIGH',
        resumeEvidence:
          'Listed under Frameworks & Libraries; built scalable multi-tenant architecture and reusable Node.js libraries.',
      },
      {
        skill: 'Relational Databases / SQL (MySQL)',
        matchType: 'EXACT',
        importance: 'HIGH',
        resumeEvidence: 'MySQL listed under Databases.',
      },
      {
        skill: 'Cloud Technologies (AWS)',
        matchType: 'EXACT',
        importance: 'MEDIUM',
        resumeEvidence: 'AWS Services listed (Cognito, S3, EC2, Cloudwatch, Lambda) and S3 Multipart Upload implementation.',
      },
    ],
    partial: [
      {
        skill: 'Web Services & Protocols (REST, JSON, HTTP)',
        matchType: 'SEMANTIC',
        importance: 'HIGH',
        resumeEvidence: 'Created shared utilities for handling HTTP requests and central error handling.',
        gap: 'SOAP and XML are not explicitly mentioned in the resume.',
      },
      {
        skill: 'UI/UX & Web Frontend (HTML, Bootstrap, Angular Material)',
        matchType: 'SEMANTIC',
        importance: 'MEDIUM',
        resumeEvidence: 'Developed dynamic tabular data rendering UI with Angular.',
        gap: 'Bootstrap and Angular Material are not explicitly listed.',
      },
    ],
    missing: [
      {
        skill: 'Linux & Shell Scripting',
        importance: 'HIGH',
        reason: 'PuTTY is listed under tools, but no explicit experience with Linux platform software development or shell scripting is provided.',
      },
      {
        skill: 'Redis',
        importance: 'HIGH',
        reason: 'In-memory caching/database store Redis is missing from the resume.',
      },
      {
        skill: 'DevOps & Containerization (Docker, Kubernetes, Jenkins, RabbitMQ)',
        importance: 'MEDIUM',
        reason: 'No evidence found for CI/CD pipelines, Docker, Kubernetes, or Message Queues in the resume.',
      },
    ],
  },
  responsibilities: {
    matched: [
      {
        responsibility: 'Design and develop back-end services and scalable architecture',
        resumeEvidence:
          'Designed and implemented a scalable multi-tenant architecture in Node.js, Express.js, and MongoDB supporting 50+ tenants.',
        matchStrength: 'HIGH',
      },
      {
        responsibility: 'Develop front-end UI/UX and web applications',
        resumeEvidence: 'Developed dynamic tabular data rendering UI with DB-driven column configuration and filters in Angular.',
        matchStrength: 'HIGH',
      },
    ],
    partial: [],
    missing: [
      {
        responsibility: 'Develop and manage software on Linux platforms using shell scripts',
        importance: 'HIGH',
      },
    ],
  },
  experience: {
    requiredExperience: '4+ years of relevant software engineering experience',
    resumeExperienceEvidence: 'Software Engineer L2 at Metacube Software Pvt. Ltd. (Oct 2021 - Present, ~2.5 years)',
    status: 'PARTIAL_MATCH',
    details:
      'The candidate has approximately 2.5 to 3 years of experience, falling short of the required 4+ years.',
  },
  education: {
    status: 'FULL_MATCH',
    matchedRequirements: [
      'Bachelor of Technology in Computer Science from Anand International College Of Engineering, Jaipur (8.88 CGPA)',
    ],
    missingRequirements: [],
  },
  certifications: {
    matched: [],
    missing: [],
  },
  projects: [
    {
      projectName: 'SQUARY AI',
      relevance: 'HIGH',
      matchedRequirements: ['Angular', 'Node.js', 'JavaScript', 'Back-end service development'],
      resumeEvidence:
        'Designed multi-tenant architecture, AI search tool integration, and Javascript chatbot handling enterprise client data.',
    },
    {
      projectName: 'Data Quality Engine (DQE)',
      relevance: 'HIGH',
      matchedRequirements: ['Node.js', 'Angular', 'AWS integration', 'Data processing concepts'],
      resumeEvidence:
        'Built dynamic UI tabular rendering components, shared utility libraries for HTTP/AWS/DB connection handling, and automated data cleaning summarizers.',
    },
  ],
  keywordAnalysis: {
    exactMatches: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'MySQL', 'AWS', 'EC2', 'S3'],
    semanticMatches: ['REST', 'JSON', 'Product Design', 'UI/UX Design'],
    missingImportantKeywords: ['Linux', 'Shell Scripting', 'Redis', 'Docker', 'Kubernetes', 'RabbitMQ', 'Jenkins', 'SOAP', 'XML'],
  },
  requirementAnalysis: [
    {
      requirement: '4+ years of relevant software engineering experience',
      category: 'EXPERIENCE',
      priority: 'REQUIRED',
      matchStatus: 'PARTIAL_MATCH',
      matchType: 'PARTIAL',
      importance: 9,
      resumeEvidence: 'Work Experience at Metacube Software Pvt. Ltd. from Oct 2021 to Present (~2.5 years).',
      reason: 'Candidate has less than the mandatory 4 years of experience.',
    },
    {
      requirement: 'Engineering Graduate from a premier institute',
      category: 'EDUCATION',
      priority: 'REQUIRED',
      matchStatus: 'FULL_MATCH',
      matchType: 'EXACT',
      importance: 8,
      resumeEvidence: 'Bachelor of Technology, Computer Science at Anand International College Of Engineering, Jaipur.',
      reason: 'Candidate possesses an engineering degree in Computer Science.',
    },
    {
      requirement: 'Software development on Linux platform and Shell scripting',
      category: 'SKILL',
      priority: 'REQUIRED',
      matchStatus: 'NO_MATCH',
      matchType: 'NONE',
      importance: 8,
      resumeEvidence: 'PuTTY listed under Tools.',
      reason: 'No direct evidence of Linux environment development or writing shell scripts.',
    },
    {
      requirement: 'Proficiency in JavaScript, TypeScript, Angular, and Node.js',
      category: 'SKILL',
      priority: 'REQUIRED',
      matchStatus: 'FULL_MATCH',
      matchType: 'EXACT',
      importance: 9,
      resumeEvidence:
        'Extensive experience listed across projects using JavaScript, TypeScript, Angular, Node.js, and Express.js.',
      reason: 'Candidate strongly meets core MEAN stack requirements.',
    },
    {
      requirement: 'Relational databases and SQL',
      category: 'SKILL',
      priority: 'REQUIRED',
      matchStatus: 'FULL_MATCH',
      matchType: 'EXACT',
      importance: 8,
      resumeEvidence: 'MySQL listed under Databases section.',
      reason: 'Direct evidence of relational database knowledge.',
    },
    {
      requirement: 'Redis in-memory data store',
      category: 'TOOL',
      priority: 'REQUIRED',
      matchStatus: 'NO_MATCH',
      matchType: 'NONE',
      importance: 7,
      resumeEvidence: '',
      reason: 'Redis is not mentioned anywhere in the resume context.',
    },
    {
      requirement: 'DevOps, Docker, Kubernetes, and Message Queues (RabbitMQ)',
      category: 'SKILL',
      priority: 'PREFERRED',
      matchStatus: 'NO_MATCH',
      matchType: 'NONE',
      importance: 7,
      resumeEvidence: '',
      reason: 'No evidence provided for Docker, Kubernetes, Jenkins, or RabbitMQ.',
    },
  ],
  strengths: [
    'Strong technical alignment with MEAN stack (Angular, Node.js, Express.js, JavaScript, TypeScript).',
    'Hands-on experience building scalable multi-tenant back-end architectures and shared utility libraries.',
    'Solid AWS cloud experience with Cognito, S3, EC2, Cloudwatch, and Lambda.',
    'Proven experience in full-stack web application development and AI enterprise tooling.',
  ],
  criticalGaps: [
    'Experience duration gap: Candidate has ~2.5 years of experience versus the required 4+ years.',
    'Lack of documented Linux platform software development and Shell Scripting experience.',
    'Missing experience with Redis in-memory data store.',
    'Lack of exposure to DevOps practices, Docker, Kubernetes, and Message Queues like RabbitMQ.',
  ],
  improvements: [
    'Highlight Linux environment usage or terminal commands used during backend development at Metacube.',
    'Explicitly detail any custom shell scripts written for automation, deployment, or build workflows.',
    'Incorporate specific UI design libraries used (e.g., Bootstrap, Angular Material, HTML5/CSS3) into frontend project descriptions if applicable.',
    'Detail web services, protocols (REST, JSON API design), and HTTP handling explicitly within backend responsibility bullets.',
  ],
};

function makeVariant(
  base: JobMatch,
  id: string,
  analyzedAt: string,
  title: string,
  seniority: string,
  summary: string,
  matchScore: number,
  matchLabel: string,
): JobMatch {
  return {
    ...base,
    id,
    analyzedAt,
    matchScore,
    matchLabel,
    job: { ...base.job, title, seniority, summary },
  };
}

export const MOCK_JOB_MATCH_HISTORY: JobMatch[] = [
  MOCK_JOB_MATCH,
  makeVariant(
    MOCK_JOB_MATCH,
    'match-2',
    'Yesterday',
    'Senior Backend Engineer',
    'Senior',
    'Design scalable APIs and microservices on AWS, using Node.js, TypeScript and PostgreSQL.',
    84,
    'Strong Alignment',
  ),
  makeVariant(
    MOCK_JOB_MATCH,
    'match-3',
    '3 days ago',
    'Full Stack Developer',
    'Mid-Level',
    'Build web applications across the full stack with Angular, Node.js and relational databases.',
    72,
    'Moderate Alignment',
  ),
];