import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services';
import { User } from '../../core/models/user.model';
import { MESSAGES } from '../../constants/constants';
import { PasswordPolicyComponent } from '../../shared/password-policy/password-policy.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PasswordPolicyComponent],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  mode: 'login' | 'signup' = 'login';
  user: User = {} as User;

  showLoginErrorMsg: boolean = false;
  loginErrMsg: string = '';
  disableLoginButton: boolean = false;
  showPassword: boolean = false;
  passwordFocused: boolean = false;
  passwordValid: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // If user is already logged in, redirect to the dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
      return;
    }

    // Capture any error returned from the auth flow
    const params = { ...this.activatedRoute.snapshot.queryParams };
    if (params['error'] && params['error_description']) {
      this.showLoginErrorMsg = true;
      this.loginErrMsg = MESSAGES.ERROR.DEFAULT;
    }
  }

  /**
   * Method to switch between sign-in and create-account mode
   * @param mode
   */
  setMode(mode: 'login' | 'signup'): void {
    this.mode = mode;
    this.showLoginErrorMsg = false;
    this.loginErrMsg = '';
    this.passwordFocused = false;
  }

  /**
   * Method to toggle password visibility
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Method to sign-in user
   */
  signIn() {
    if (this.user && this.user.email && this.user.password) {
      this.disableLoginButton = true;
      this.authService
        .login(this.user.email, this.user.password)
        .then(() => {
          this.router.navigate(['dashboard']);
        })
        .catch((err) => {
          console.error(`Error occurred while signing-in, err:`, err);
          this.disableLoginButton = false;
          this.showLoginErrorMsg = true;
          this.loginErrMsg = this.getErrorMessage(err, MESSAGES.ERROR.LOGIN_FAILED);
        });
    } else {
      this.showLoginErrorMsg = true;
      this.loginErrMsg = 'Please enter email and password.';
    }
  }

  /**
   * Method to sign-up a new user, then log them in automatically
   */
  signUp() {
    if (
      this.user &&
      this.user.first_name &&
      this.user.last_name &&
      this.user.email &&
      this.user.password
    ) {
      if (!this.passwordValid) {
        this.showLoginErrorMsg = true;
        this.loginErrMsg =
          'Please choose a stronger password. It must meet all the requirements shown below.';
        return;
      }
      this.disableLoginButton = true;
      this.authService
        .signup(this.user)
        .then(() => this.authService.login(this.user.email, this.user.password!))
        .then(() => {
          this.router.navigate(['dashboard']);
        })
        .catch((err) => {
          console.error(`Error occurred while signing-up, err:`, err);
          this.disableLoginButton = false;
          this.showLoginErrorMsg = true;
          this.loginErrMsg = this.getErrorMessage(err, MESSAGES.ERROR.DEFAULT);
        });
    } else {
      this.showLoginErrorMsg = true;
      this.loginErrMsg = 'Please fill in all fields.';
    }
  }

  /**
   * Method to extract a human readable message from an API error
   * @param err
   * @param fallback
   */
  private getErrorMessage(err: any, fallback: string): string {
    return err?.error?.message || err?.message || fallback;
  }
}