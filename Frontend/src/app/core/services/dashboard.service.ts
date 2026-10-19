import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ActivityGroup,
  InterviewEvaluation,
  InterviewQuestion,
  JobMatchResult,
  ProfileData,
  ResumeAnalysis,
} from '../models/dashboard.model';
import { ResumeRecord } from '../models/resume.model';
import {
  MOCK_ACTIVITY,
  MOCK_ANALYSIS,
  MOCK_INTERVIEW_EVALUATION,
  MOCK_INTERVIEW_QUESTIONS,
  MOCK_JOB_MATCH,
  MOCK_PROFILE,
  MOCK_QA_ANSWER,
  MOCK_QA_SOURCE,
  MOCK_SUGGESTED_QUESTIONS,
} from '../mocks/dashboard.mock';
import { ApiService } from './api.service';

const DASHBOARD_URL = '/dashboard';

/**
 * Dashboard data service.
 *
 * The latest analysed resume is fetched from the API. The remaining sections
 * still return centralized mock data until their APIs become available.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private apiService: ApiService) {}

  /**
   * Method to get the latest analysed resume of the logged-in user. The user
   * is derived from the token on the API side.
   * @returns
   */
  getLatestAnalyzedResume(): Observable<ResumeRecord | null> {
    return this.apiService
      .get(DASHBOARD_URL)
      .pipe(
        map(
          (payload: { latest_resume: ResumeRecord | null }) =>
            payload?.latest_resume ?? null,
        ),
      );
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

  getProfile(): Observable<ProfileData> {
    return of(MOCK_PROFILE);
  }
}
