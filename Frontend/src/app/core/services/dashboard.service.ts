import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
import {
  MOCK_ACTIVITY,
  MOCK_ANALYSIS,
  MOCK_IMPROVEMENT,
  MOCK_INSIGHTS,
  MOCK_INTERVIEW_EVALUATION,
  MOCK_INTERVIEW_QUESTIONS,
  MOCK_JOB_MATCH,
  MOCK_PROFILE,
  MOCK_QA_ANSWER,
  MOCK_QA_SOURCE,
  MOCK_RESUME_STATUS,
  MOCK_SKILL_GAPS,
  MOCK_STATS,
  MOCK_SUGGESTED_QUESTIONS,
} from '../mocks/dashboard.mock';

/**
 * Dashboard data service.
 *
 * Currently returns centralized mock data. Swap the `of(...)` calls for
 * HTTP requests (via ApiService) when the ResumeIQ APIs become available.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  getResumeStatus(): Observable<ResumeStatus> {
    return of(MOCK_RESUME_STATUS);
  }

  getStats(): Observable<Stat[]> {
    return of(MOCK_STATS);
  }

  getInsights(): Observable<Insight[]> {
    return of(MOCK_INSIGHTS);
  }

  getRecentActivity(): Observable<ActivityGroup[]> {
    return of(MOCK_ACTIVITY);
  }

  getResumeAnalysis(): Observable<ResumeAnalysis> {
    return of(MOCK_ANALYSIS);
  }

  getJobMatchResult(): Observable<JobMatchResult> {
    return of(MOCK_JOB_MATCH);
  }

  getSuggestedQuestions(): Observable<string[]> {
    return of(MOCK_SUGGESTED_QUESTIONS);
  }

  getQaAnswer(_question: string): Observable<{ answer: string; source: string }> {
    return of({ answer: MOCK_QA_ANSWER, source: MOCK_QA_SOURCE });
  }

  getInterviewQuestions(): Observable<InterviewQuestion[]> {
    return of(MOCK_INTERVIEW_QUESTIONS);
  }

  getInterviewEvaluation(): Observable<InterviewEvaluation> {
    return of(MOCK_INTERVIEW_EVALUATION);
  }

  getSkillGaps(): Observable<SkillGapData> {
    return of(MOCK_SKILL_GAPS);
  }

  getProfile(): Observable<ProfileData> {
    return of(MOCK_PROFILE);
  }

  getImprovementData(): Observable<ImprovementData> {
    return of(MOCK_IMPROVEMENT);
  }
}