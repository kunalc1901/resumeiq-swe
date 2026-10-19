import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services';
import { User } from '../../core/models/user.model';
import { MESSAGES } from '../../constants/constants';
import { PasswordPolicyComponent } from '../../shared/password-policy/password-policy.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
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

  // Email verification step (pools that require sign-up confirmation)
  verificationPending: boolean = false;
  verificationCode: string = '';
  verificationNotice: string = '';

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
  async signIn(): Promise<void> {
    if (this.user && this.user.email && this.user.password) {
      this.disableLoginButton = true;
      this.showLoginErrorMsg = false;
      this.verificationNotice = '';
      try {
        await this.authService.login(this.user.email, this.user.password);
        this.router.navigate(['dashboard']);
      } catch (err) {
        console.error(`Error occurred while signing-in, err:`, err);
        this.disableLoginButton = false;
        // Unconfirmed account - ask for the emailed verification code.
        if ((err as any)?.name === 'UserNotConfirmedException') {
          this.startVerification();
          return;
        }
        this.showLoginErrorMsg = true;
        // Keep technical details out of the UI - show a generic message.
        this.loginErrMsg = MESSAGES.ERROR.LOGIN_FAILED;
      }
    } else {
      this.showLoginErrorMsg = true;
      this.loginErrMsg = 'Please enter email and password.';
    }
  }

  /**
   * Method to sign-up a new user. When the pool requires email verification
   * the card switches to the verification step, otherwise the user is signed
   * in automatically.
   */
  async signUp(): Promise<void> {
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
      this.showLoginErrorMsg = false;
      this.verificationNotice = '';
      try {
        const res = await this.authService.signup(this.user);
        if (res?.needsConfirmation) {
          // The pool requires email verification - ask for the emailed code.
          this.startVerification();
          return;
        }
        await this.authService.login(this.user.email, this.user.password);
        this.router.navigate(['dashboard']);
      } catch (err) {
        console.error(`Error occurred while signing-up, err:`, err);
        this.disableLoginButton = false;
        // Signup succeeded but the account still needs confirming.
        if ((err as any)?.name === 'UserNotConfirmedException') {
          this.startVerification();
          return;
        }
        this.showLoginErrorMsg = true;
        // Keep technical details out of the UI - show a generic message.
        this.loginErrMsg = MESSAGES.ERROR.SIGNUP_FAILED;
      }
    } else {
      this.showLoginErrorMsg = true;
      this.loginErrMsg = 'Please fill in all fields.';
    }
  }

  /**
   * Method to verify the email with the code Cognito sent, then sign the user in
   */
  async verifyEmail(): Promise<void> {
    if (!this.verificationCode) {
      this.showLoginErrorMsg = true;
      this.loginErrMsg = 'Please enter the verification code.';
      return;
    }
    this.disableLoginButton = true;
    this.showLoginErrorMsg = false;
    this.verificationNotice = '';
    try {
      await this.authService.confirmSignup(this.user.email, this.verificationCode);
    } catch (err) {
      console.error(`Error occurred while verifying the email, err:`, err);
      this.disableLoginButton = false;
      this.showLoginErrorMsg = true;
      // Keep technical details out of the UI - show a generic message.
      this.loginErrMsg = MESSAGES.ERROR.VERIFICATION_FAILED;
      return;
    }
    try {
      await this.authService.login(this.user.email, this.user.password!);
      this.router.navigate(['dashboard']);
    } catch (err) {
      console.error(`Error occurred while signing-in after verification, err:`, err);
      this.disableLoginButton = false;
      this.showLoginErrorMsg = true;
      this.loginErrMsg = MESSAGES.ERROR.LOGIN_FAILED;
    }
  }

  /**
   * Method to resend the signup verification code
   */
  async resendCode(): Promise<void> {
    this.disableLoginButton = true;
    this.showLoginErrorMsg = false;
    this.verificationNotice = '';
    try {
      await this.authService.resendSignupCode(this.user.email);
      this.verificationNotice = 'A new code has been sent to your email.';
    } catch (err) {
      console.error(`Error occurred while resending the verification code, err:`, err);
      this.showLoginErrorMsg = true;
      this.loginErrMsg = MESSAGES.ERROR.RESEND_FAILED;
    } finally {
      this.disableLoginButton = false;
    }
  }

  /**
   * Method to switch the card to the email verification step
   */
  private startVerification(): void {
    this.verificationPending = true;
    this.verificationCode = '';
    this.verificationNotice = '';
    this.showLoginErrorMsg = false;
    this.loginErrMsg = '';
    this.disableLoginButton = false;
  }

  /**
   * Method to leave the verification step and return to the form
   */
  cancelVerification(): void {
    this.verificationPending = false;
    this.verificationCode = '';
    this.verificationNotice = '';
    this.showLoginErrorMsg = false;
    this.loginErrMsg = '';
  }
}