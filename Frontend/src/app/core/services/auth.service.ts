import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CognitoService } from './cognito.service';
import { User } from '../models/user.model';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUserData: any = {};
  is_admin = false;

  constructor(
    public router: Router,
    private cognitoService: CognitoService,
  ) {}

  /**
   * Method to login via Cognito and store the session
   * @param email
   * @param password
   */
  async login(email: string, password: string): Promise<any> {
    try {
      const res = await this.cognitoService.login(email, password);
      this.storeSession(res);
      return res;
    } catch (err) {
      console.error(`Error occurred while logging in, err:`, err);
      throw err;
    }
  }

  /**
   * Method to sign up a new user (Cognito user pool)
   * @param user
   */
  async signup(user: User): Promise<any> {
    try {
      return await this.cognitoService.signup(user);
    } catch (err) {
      console.error(`Error occurred while signing up, err:`, err);
      throw err;
    }
  }

  /**
   * Method to confirm a signup with the verification code Cognito emailed
   * @param email
   * @param code
   */
  async confirmSignup(email: string, code: string): Promise<any> {
    try {
      return await this.cognitoService.confirmSignup(email, code);
    } catch (err) {
      console.error(`Error occurred while confirming signup, err:`, err);
      throw err;
    }
  }

  /**
   * Method to resend the signup verification code
   * @param email
   */
  async resendSignupCode(email: string): Promise<any> {
    try {
      return await this.cognitoService.resendSignupCode(email);
    } catch (err) {
      console.error(`Error occurred while resending the verification code, err:`, err);
      throw err;
    }
  }

  /**
   * Method to renew the session
   */
  async refresh(): Promise<any> {
    try {
      const res = await this.cognitoService.refresh();
      this.storeSession(res);
      return res;
    } catch (err) {
      console.error(`Error occurred while refreshing session, err:`, err);
      throw err;
    }
  }

  /**
   * Method to logout user and redirect to home
   */
  logout(): void {
    // Clear the app-side session immediately so the UI reacts, then revoke
    // the Cognito session in the background.
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.loggedInUserData = {};
    this.is_admin = false;
    this.cognitoService
      .logout()
      .catch((err) => console.error(`Error occurred while logging out, err:`, err));
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
   * Method to get the ID token (JWT)
   * @returns
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Method to get the access token
   * @returns
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  /**
   * Method to get the refresh token
   * @returns
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
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
   * Method to check if the logged-in user is an admin. The flag lives in
   * Cognito as the `custom:is_admin` attribute, so it is read from the
   * stored ID token claims.
   * @returns
   */
  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const claims: any = jwtDecode(token);
      return this.claimToBoolean(claims['custom:is_admin']);
    } catch {
      return false;
    }
  }

  /**
   * Method to store the token set + user profile of the Cognito session
   * @param res
   */
  private storeSession(res: any): void {
    if (res?.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    }
    if (res?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, res.accessToken);
    }
    if (res?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, res.refreshToken);
    }
    if (res?.user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      this.loggedInUserData = res.user;
    }
    // Read the admin flag straight from the stored Cognito ID token.
    this.is_admin = this.isAdmin();
  }

  /**
   * Method to normalize a Cognito custom attribute value ("true"/"1") to boolean
   * @param value
   * @returns
   */
  private claimToBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value === 1;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return normalized === 'true' || normalized === '1';
    }
    return false;
  }
}
