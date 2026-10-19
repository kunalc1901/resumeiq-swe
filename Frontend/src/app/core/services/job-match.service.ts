import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  JobMatch,
  JobMatchListRecord,
  JobMatchRecord,
  JobMatchResumePayload,
  JobMatchResumeRef,
  JobMatchScoreCategory,
  JobMatchSummary,
} from '../models/job-match.model';
import { MOCK_JOB_MATCH } from '../mocks/job-match.mock';
import { ApiService } from './api.service';
import { RESUME_USER_ID } from './resume.service';

const JOB_MATCH_URL = '/job-match';

/**
 * Job Match data service.
 *
 * The match history and match details come from the JobMatchIQ API. The
 * "analyze" flow still returns a mock result until the analyse endpoint is
 * wired up.
 */
@Injectable({ providedIn: 'root' })
export class JobMatchService {
  private nextId = 100;

  constructor(private apiService: ApiService) {}

  /** Fetch all previous job matches of a user, newest first. */
  getHistory(userId: string = RESUME_USER_ID): Observable<JobMatchSummary[]> {
    const params = new HttpParams().set('user_id', userId);
    return this.apiService
      .get(JOB_MATCH_URL, undefined, params)
      .pipe(
        map((records: JobMatchListRecord[]) =>
          (records ?? []).map((record) => this.toSummary(record)),
        ),
      );
  }

  /** Fetch a single job match (full analysis) by id. */
  getById(id: string): Observable<JobMatch | null> {
    return this.apiService
      .get(`${JOB_MATCH_URL}/${id}`)
      .pipe(map((record: JobMatchRecord) => (record ? this.toJobMatch(record) : null)));
  }

  /** Run a new analysis. Returns the JobMatch result and stores it in history. */
  analyzeMatch(_jdText: string): Observable<JobMatch> {
    const match: JobMatch = {
      ...MOCK_JOB_MATCH,
      id: `match-${this.nextId++}`,
      analyzedAt: 'Just now',
    };
    return of(match);
  }

  /** Maps a list record to the card view model used in the history grid. */
  private toSummary(record: JobMatchListRecord): JobMatchSummary {
    const analysis = record.analysis;
    return {
      id: record._id,
      analyzedAt: this.relativeTime(record.created_at),
      matchScore: analysis?.match_score ?? 0,
      matchLabel: analysis?.match_label ?? '',
      resume: this.toResumeRef(record.resume),
      job: {
        title: analysis?.job?.title ?? '',
        seniority: analysis?.job?.seniority ?? '',
        summary: analysis?.job?.summary ?? '',
      },
    };
  }

  /** Maps a stored job match document to the view model used on the detail page. */
  private toJobMatch(record: JobMatchRecord): JobMatch {
    const a = record.analysis;
    const breakdown = a?.score_breakdown;
    return {
      id: record._id,
      analyzedAt: this.relativeTime(record.created_at),
      matchScore: a?.match_score ?? 0,
      matchLabel: a?.match_label ?? '',
      resume: this.toResumeRef(record.resume),
      job: {
        title: a?.job?.title ?? '',
        seniority: a?.job?.seniority ?? '',
        summary: a?.job?.summary ?? '',
      },
      scoreBreakdown: {
        requiredSkills: this.toScoreCategory(breakdown?.required_skills),
        responsibilities: this.toScoreCategory(breakdown?.responsibilities),
        experience: this.toScoreCategory(breakdown?.experience),
        preferredQualifications: this.toScoreCategory(
          breakdown?.preferred_qualifications,
        ),
        projectsDomainRelevance: this.toScoreCategory(
          breakdown?.projects_domain_relevance,
        ),
        educationCertifications: this.toScoreCategory(
          breakdown?.education_certifications,
        ),
        keywordAlignment: this.toScoreCategory(breakdown?.keyword_alignment),
      },
      skills: {
        matched: (a?.skills?.matched ?? []).map((s) => ({
          skill: s.skill ?? '',
          matchType: s.match_type ?? '',
          importance: s.importance ?? '',
          resumeEvidence: s.resume_evidence ?? '',
          gap: s.gap,
        })),
        partial: (a?.skills?.partial ?? []).map((s) => ({
          skill: s.skill ?? '',
          matchType: s.match_type ?? '',
          importance: s.importance ?? '',
          resumeEvidence: s.resume_evidence ?? '',
          gap: s.gap,
        })),
        missing: (a?.skills?.missing ?? []).map((s) => ({
          skill: s.skill ?? '',
          importance: s.importance ?? '',
          reason: s.reason ?? '',
        })),
      },
      responsibilities: {
        matched: (a?.responsibilities?.matched ?? []).map((r) => ({
          responsibility: r.responsibility ?? '',
          resumeEvidence: r.resume_evidence ?? '',
          matchStrength: r.match_strength ?? '',
        })),
        partial: (a?.responsibilities?.partial ?? []).map((r) => ({
          responsibility: r.responsibility ?? '',
          resumeEvidence: r.resume_evidence ?? '',
          gap: r.gap,
        })),
        missing: (a?.responsibilities?.missing ?? []).map((r) => ({
          responsibility: r.responsibility ?? '',
          importance: r.importance ?? '',
        })),
      },
      experience: {
        requiredExperience: a?.experience?.required_experience ?? '',
        resumeExperienceEvidence: a?.experience?.resume_experience_evidence ?? '',
        status: a?.experience?.status ?? '',
        details: a?.experience?.details ?? '',
      },
      education: {
        status: a?.education?.status ?? '',
        matchedRequirements: a?.education?.matched_requirements ?? [],
        missingRequirements: a?.education?.missing_requirements ?? [],
      },
      certifications: {
        matched: a?.certifications?.matched ?? [],
        missing: a?.certifications?.missing ?? [],
      },
      projects: (a?.projects ?? []).map((p) => ({
        projectName: p.project_name ?? '',
        relevance: p.relevance ?? '',
        matchedRequirements: p.matched_requirements ?? [],
        resumeEvidence: p.resume_evidence ?? '',
      })),
      keywordAnalysis: {
        exactMatches: a?.keyword_analysis?.exact_matches ?? [],
        semanticMatches: a?.keyword_analysis?.semantic_matches ?? [],
        missingImportantKeywords:
          a?.keyword_analysis?.missing_important_keywords ?? [],
      },
      requirementAnalysis: (a?.requirement_analysis ?? []).map((r) => ({
        requirement: r.requirement ?? '',
        category: r.category ?? '',
        priority: r.priority ?? '',
        matchStatus: r.match_status ?? '',
        matchType: r.match_type ?? '',
        importance: r.importance ?? 0,
        resumeEvidence: r.resume_evidence ?? '',
        reason: r.reason ?? '',
      })),
      strengths: a?.strengths ?? [],
      criticalGaps: a?.critical_gaps ?? [],
      improvements: a?.improvements ?? [],
    };
  }

  private toScoreCategory(category?: {
    score: number;
    max_score: number;
  }): JobMatchScoreCategory {
    return {
      score: category?.score ?? 0,
      maxScore: category?.max_score ?? 0,
    };
  }

  /** Maps the joined resume payload to the view model (null when unavailable). */
  private toResumeRef(payload?: JobMatchResumePayload | null): JobMatchResumeRef | null {
    if (!payload?.id) {
      return null;
    }
    return {
      id: payload.id,
      fileName: payload.file_name || 'Untitled resume',
    };
  }

  /** Formats an ISO timestamp as a short relative label ("2 days ago"). */
  private relativeTime(iso: string): string {
    const time = this.toTime(iso);
    if (!time) {
      return '';
    }
    const minutes = Math.floor((Date.now() - time) / 60000);
    if (minutes < 1) {
      return 'just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return days === 1 ? 'yesterday' : `${days} days ago`;
    }
    const weeks = Math.floor(days / 7);
    if (days < 30) {
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }
    return new Date(time).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  private toTime(iso: string): number {
    const time = new Date(iso).getTime();
    return Number.isNaN(time) ? 0 : time;
  }
}
