import { HttpParams } from '@angular/common/http';
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
import { RESUME_USER_ID } from './resume.service';

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
   * Method to get the latest analysed resume of a user
   * @param userId
   * @returns
   */
  getLatestAnalyzedResume(
    userId: string = RESUME_USER_ID,
  ): Observable<ResumeRecord | null> {
    const params = new HttpParams().set('user_id', userId);
    return this.apiService
      .get(DASHBOARD_URL, undefined, params)
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
