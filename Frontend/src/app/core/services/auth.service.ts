import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  USER_ROLE,
} from '../../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUserData: any = {};
  user_role = USER_ROLE.PUBLIC;

  constructor(
    public router: Router,
    private userService: UserService,
  ) {}

  /**
   * Method to login a user and store token + user data
   * @param email
   * @param password
   */
  login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.login(email, password).subscribe({
        next: (res: any) => {
          const token = res['token'];
          const user = res['user'];
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          this.loggedInUserData = user;
          this.user_role = user['role'] || USER_ROLE.USER;
          resolve(res);
        },
        error: (err) => {
          console.error(`Error occurred while logging in, err:`, err);
          reject(err);
        },
      });
    });
  }

  /**
   * Method to sign up a new user
   * @param user
   */
  signup(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.signup(user).subscribe({
        next: (res: any) => resolve(res),
        error: (err) => {
          console.error(`Error occurred while signing up, err:`, err);
          reject(err);
        },
      });
    });
  }

  /**
   * Method to logout user and redirect to login page
   */
  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.loggedInUserData = {};
    this.user_role = USER_ROLE.PUBLIC;
    this.router.navigate(['/']);
  }

  /**
   * Method to check if user is authenticated
   * @returns true if a valid token is stored
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const decoded: any = jwtDecode(token);
      if (decoded && decoded.exp) {
        // token expiry is in epoch seconds
        if (decoded.exp * 1000 < Date.now()) {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Method to get the access token
   * @returns
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Method to get logged in user from local storage
   * @returns
   */
  getUser(): any {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Method to get logged-in user's role
   * @returns
   */
  getUserRole(): string {
    const user = this.getUser();
    return user ? user['role'] : USER_ROLE.PUBLIC;
  }
}