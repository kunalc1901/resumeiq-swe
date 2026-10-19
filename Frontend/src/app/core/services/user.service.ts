import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

const USER_URL = '/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Method to get users list
   */
  getUsersList(query: any = {}): Observable<any> {
    return this.apiService.get(USER_URL, undefined, query).pipe();
  }
}