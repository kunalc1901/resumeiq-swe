import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ResumeRecord } from '../models/resume.model';

const RESUME_URL = '/resume';

/**
 * Temporary: the logged-in user's id is not carried by the API yet, so
 * resumes are fetched for this user until auth resolves it instead.
 */
export const RESUME_USER_ID = 'a1cbb560-30e1-7047-ae5e-5206af9379ea';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  constructor(private apiService: ApiService) {}

  /**
   * Method to get all resumes of a user, newest first
   * @param userId
   * @returns
   */
  getResumes(userId: string = RESUME_USER_ID): Observable<ResumeRecord[]> {
    const params = new HttpParams().set('user_id', userId);
    return this.apiService.get(RESUME_URL, undefined, params);
  }
}
