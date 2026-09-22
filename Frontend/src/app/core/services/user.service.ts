import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

const USER_URL = '/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Method to login a user
   * @param email
   * @param password
   * @returns
   */
  login(email: string, password: string): Observable<any> {
    return this.apiService.post(`${USER_URL}/login`, { email, password });
  }

  /**
   * Method to signup a user
   * @param user
   * @returns
   */
  signup(user: User): Observable<any> {
    return this.apiService.post(`${USER_URL}/signup`, user);
  }

  /**
   * Method to get users list
   */
  getUsersList(query: any = {}): Observable<any> {
    return this.apiService.get(USER_URL, undefined, query).pipe();
  }
}