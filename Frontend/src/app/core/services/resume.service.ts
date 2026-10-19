import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ResumeRecord } from '../models/resume.model';

const RESUME_URL = '/resume';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  constructor(private apiService: ApiService) {}

  /**
   * Method to get all resumes of the logged-in user, newest first. The user is
   * derived from the token on the API side.
   * @returns
   */
  getResumes(): Observable<ResumeRecord[]> {
    return this.apiService.get(RESUME_URL);
  }
}
