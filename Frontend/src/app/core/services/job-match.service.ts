import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobMatch } from '../models/job-match.model';
import { MOCK_JOB_MATCH_HISTORY, MOCK_JOB_MATCH } from '../mocks/job-match.mock';

/**
 * Job Match data service.
 *
 * Currently mock-backed so the UI can be built against the backend response
 * shape. Swap the `of(...)`/mock calls for ApiService calls when the endpoints
 * exist:
 *   POST   /job-match            -> analyzeMatch
 *   GET    /job-match            -> getHistory
 *   GET    /job-match/:id        -> getById
 *   DELETE /job-match/:id        -> deleteMatch
 */
@Injectable({ providedIn: 'root' })
export class JobMatchService {
  private history: JobMatch[] = [...MOCK_JOB_MATCH_HISTORY];
  private nextId = 100;

  /** Run a new analysis. Returns the JobMatch result and stores it in history. */
  analyzeMatch(_jdText: string): Observable<JobMatch> {
    const match: JobMatch = {
      ...MOCK_JOB_MATCH,
      id: `match-${this.nextId++}`,
      analyzedAt: 'Just now',
    };
    this.history = [match, ...this.history];
    return of(match);
  }

  /** Fetch all previous job matches. */
  getHistory(): Observable<JobMatch[]> {
    return of([...this.history]);
  }

  /** Fetch a single job match by id. */
  getById(id: string): Observable<JobMatch | null> {
    const match = this.history.find((m) => m.id === id);
    return of(match ?? null);
  }

  /** Delete a job match (mock). */
  deleteMatch(id: string): Observable<void> {
    this.history = this.history.filter((m) => m.id !== id);
    return of(undefined);
  }
}