import {
  ActivityGroup,
  ImprovementData,
  Insight,
  InterviewEvaluation,
  InterviewQuestion,
  JobMatchResult,
  ProfileData,
  ResumeAnalysis,
  ResumeStatus,
  SkillGapData,
  Stat,
} from '../models/dashboard.model';

/**
 * Centralized demo data for the ResumeIQ dashboard.
 * Replace with HTTP-backed data via DashboardService once APIs are available.
 */

export const MOCK_RESUME_STATUS: ResumeStatus = {
  fileName: 'Software_Engineer_Resume.pdf',
  lastAnalyzed: 'Today',
  overallScore: 82,
  atsScore: 78,
};

export const MOCK_STATS: Stat[] = [
  {
    id: 'score',
    label: 'Overall Resume Score',
    value: '82',
    sub: 'out of 100',
    icon: 'star',
    tone: 'accent',
    progress: 82,
  },
  {
    id: 'ats',
    label: 'ATS Compatibility',
    value: '78%',
    sub: 'parses cleanly',
    icon: 'file-text',
    tone: 'success',
    progress: 78,
  },
  {
    id: 'skills',
    label: 'Skills Identified',
    value: '24',
    sub: 'across 3 groups',
    icon: 'layers',
    tone: 'info',
  },
  {
    id: 'gaps',
    label: 'Areas to Improve',
    value: '6',
    sub: 'actionable items',
    icon: 'alert-triangle',
    tone: 'warn',
  },
];

export const MOCK_INSIGHTS: Insight[] = [
  {
    id: 'kw',
    icon: 'search',
    category: 'Missing Keywords',
    title: 'Cloud keywords could help',
    description:
      'Your resume may benefit from highlighting cloud deployment experience.',
  },
  {
    id: 'strong',
    icon: 'code',
    category: 'Strong Skill',
    title: 'Backend is your strength',
    description:
      'Your backend experience is one of the strongest sections of your profile.',
  },
  {
    id: 'improve',
    icon: 'sparkles',
    category: 'Resume Improvement',
    title: 'Make projects more measurable',
    description:
      '3 project descriptions could be made more measurable.',
  },
  {
    id: 'structure',
    icon: 'layers',
    category: 'Structure',
    title: 'Good keyword coverage',
    description:
      'Your resume uses relevant keywords consistently across sections.',
  },
];

export const MOCK_ACTIVITY: ActivityGroup[] = [
  {
    date: 'Today',
    items: [
      { icon: 'file-text', text: 'Resume analyzed', detail: 'Software_Engineer_Resume.pdf' },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      { icon: 'target', text: 'Job match completed', detail: 'Senior Frontend Developer' },
    ],
  },
  {
    date: 'Sep 18',
    items: [
      { icon: 'mic', text: 'Interview session completed', detail: 'Node.js Backend Interview' },
    ],
  },
];

export const MOCK_ANALYSIS: ResumeAnalysis = {
  fileName: 'Software_Engineer_Resume.pdf',
  overallScore: 82,
  atsScore: 78,
  summary:
    'John is a Software Engineer with strong full-stack experience centered on Node.js, MongoDB and React. The resume shows solid hands-on project work and clear backend depth, with room to make impact and outcomes more measurable.',
  skills: [
    {
      group: 'Technical Skills',
      skills: ['Node.js', 'JavaScript', 'TypeScript', 'Python', 'MongoDB', 'REST APIs', 'React', 'Express'],
    },
    {
      group: 'Soft Skills',
      skills: ['Problem Solving', 'Communication', 'Collaboration', 'Time Management'],
    },
    {
      group: 'Tools & Technologies',
      skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Mongoose', 'JWT', 'Docker (basic)'],
    },
  ],
  experience: [
    {
      role: 'Software Engineer',
      company: 'TechNova Solutions',
      period: 'Jan 2022 – Present',
      points: [
        'Developed RESTful APIs using Node.js and Express for client-facing products.',
        'Built and maintained MongoDB data models supporting real-time features.',
        'Collaborated with product and design teams to ship quarterly releases.',
      ],
    },
    {
      role: 'Junior Backend Developer',
      company: 'CloudSphere',
      period: 'Jun 2020 – Dec 2021',
      points: [
        'Implemented authentication and authorization flows with JWT.',
        'Optimized database queries, reducing average response time.',
        'Wrote integration tests for core API endpoints.',
      ],
    },
  ],
  projects: [
    {
      name: 'TaskFlow API',
      stack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      description:
        'A REST API for team task management with role-based access and real-time updates.',
    },
    {
      name: 'DevConnect',
      stack: ['React', 'Node.js', 'MongoDB'],
      description:
        'A developer networking platform with profiles, posts and direct messaging.',
    },
    {
      name: 'Inventory Dashboard',
      stack: ['Python', 'Flask', 'SQL'],
      description:
        'An analytics dashboard for warehouse inventory with CSV import and reporting.',
    },
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      period: '2016 – 2020',
    },
  ],
  strengths: [
    'Strong backend development foundation',
    'Clear, well-structured project history',
    'Relevant modern stack experience',
    'Good balance of technical and soft skills',
  ],
  areasToImprove: [
    'Add measurable achievements and outcomes',
    'Strengthen cloud and deployment experience',
    'Improve keyword coverage for target roles',
    'Quantify project impact with metrics',
  ],
  missingKeywords: ['AWS', 'Docker', 'CI/CD', 'Kubernetes', 'Terraform'],
  improvementSuggestions: [
    {
      title: 'Quantify outcomes',
      description:
        'Add metrics such as "reduced response time by 30%" where data is available in the original resume.',
      priority: 'high',
    },
    {
      title: 'Add a skills summary',
      description:
        'Place a concise skills line near the top so recruiters see core strengths immediately.',
      priority: 'high',
    },
    {
      title: 'Expand project impact',
      description:
        'Describe project outcomes and users served, using only facts present in the resume.',
      priority: 'medium',
    },
    {
      title: 'Align keywords with roles',
      description:
        'Mirror terminology from target job descriptions where it matches your actual experience.',
      priority: 'medium',
    },
  ],
};

export const MOCK_JOB_MATCH: JobMatchResult = {
  score: 82,
  matchedSkills: ['Node.js', 'MongoDB', 'REST APIs', 'Angular', 'TypeScript'],
  missingSkills: ['AWS', 'Docker', 'CI/CD'],
  relevantExperience: [
    'Backend API development at TechNova Solutions',
    'Authentication and authorization implementation',
    'MongoDB schema design and query optimization',
  ],
  recommendations: [
    'Highlight cloud deployment experience in your projects section.',
    'Add a CI/CD bullet if you have used pipelines in prior roles.',
    'Mirror job-description keywords where they match your real experience.',
  ],
};

export const MOCK_SUGGESTED_QUESTIONS: string[] = [
  'What are my strongest technical skills?',
  'Summarize my experience.',
  'What should I improve?',
];

export const MOCK_QA_ANSWER =
  'Based on your resume, your backend experience centers on Node.js, Express and MongoDB. ' +
  'Your strongest evidence is the TaskFlow API project, where you built a REST API with role-based access, ' +
  'and your role at TechNova Solutions developing RESTful APIs for client products.';

export const MOCK_QA_SOURCE = 'Resume → Projects → Page 2';

export const MOCK_SKILL_GAPS: SkillGapData = {
  yourSkills: ['Node.js', 'MongoDB', 'Angular', 'Python', 'REST APIs'],
  targetSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  gaps: [
    { skill: 'AWS', level: 15, note: 'Mentioned as a tool, no hands-on bullet found.' },
    { skill: 'Docker', level: 20, note: 'Basic usage noted in a project.' },
    { skill: 'CI/CD', level: 10, note: 'Not mentioned in the current resume.' },
    { skill: 'Kubernetes', level: 5, note: 'Not mentioned in the current resume.' },
  ],
};

export const MOCK_PROFILE: ProfileData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@resumeiq.dev',
  targetRole: 'Full Stack Developer',
  experienceLevel: 'Mid-level (3–5 years)',
  technologies: ['Node.js', 'MongoDB', 'React', 'TypeScript', 'Python'],
};

export const MOCK_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    prompt:
      'You mentioned building a REST API using Node.js. How did you handle authentication and authorization?',
    followUp:
      'How would you secure an API that also needs to support third-party integrations?',
  },
  {
    prompt:
      'Your resume mentions MongoDB schema design. How do you decide when to use embedded documents versus references?',
    followUp: 'How would you handle data consistency in a distributed MongoDB setup?',
  },
  {
    prompt:
      'Walk me through the architecture of the TaskFlow API project from start to finish.',
    followUp: 'What would you improve if you were to rebuild it today?',
  },
  {
    prompt:
      'You list REST APIs as a core skill. How do you design endpoints for a resource with nested relationships?',
    followUp: 'When would you prefer GraphQL over REST?',
  },
  {
    prompt:
      'Describe a time you optimized database queries. What was the outcome?',
    followUp: 'What tools did you use to profile the slow queries?',
  },
];

export const MOCK_INTERVIEW_EVALUATION: InterviewEvaluation = {
  strengths: [
    'Clear understanding of authentication flows',
    'Good structured answer with concrete examples',
  ],
  weaknesses: [
    'Could mention token expiry and refresh strategy',
    'Answer could include a security consideration such as HTTPS',
  ],
  suggestedAnswer:
    'I would start by outlining the auth flow: registration, login issuing a JWT, middleware verifying the token on protected routes, role-based checks for authorization, and token refresh for long sessions.',
  followUp:
    'How would you secure an API that also needs to support third-party integrations?',
};

export const MOCK_IMPROVEMENT: ImprovementData = {
  summary: {
    current:
      'Software Engineer with experience building web applications using JavaScript, Node.js and MongoDB.',
    suggested:
      'Software Engineer experienced in building scalable web applications with Node.js, Express and MongoDB, focused on backend APIs and developer-facing products.',
  },
  experience: [
    {
      current: 'Worked on backend APIs using Node.js.',
      suggested:
        'Developed RESTful APIs using Node.js and Express, implementing scalable backend services for client-facing products.',
    },
    {
      current: 'Used MongoDB for data storage.',
      suggested:
        'Built and maintained MongoDB data models supporting real-time features across products.',
    },
  ],
  projects: [
    {
      current: 'Built a task management API.',
      suggested:
        'Designed a REST API for team task management with role-based access and real-time updates using Node.js, Express and MongoDB.',
    },
  ],
  skills: {
    current: 'Node.js, Express, MongoDB, React, JavaScript',
    suggested:
      'Backend: Node.js, Express, MongoDB, REST APIs · Frontend: React, TypeScript · Tools: Git, Postman',
  },
};