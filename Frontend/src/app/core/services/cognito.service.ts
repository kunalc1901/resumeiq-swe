import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import {
  confirmSignUp,
  fetchAuthSession,
  fetchUserAttributes,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
} from 'aws-amplify/auth';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

/**
 * AWS Cognito authentication, handled entirely in the frontend via AWS Amplify.
 *
 * One-time user pool setup (console or CDK), then fill the placeholders in
 * `src/environments/environment.ts`:
 *  - Sign-in: email + password; app client WITHOUT a client secret
 *    (Amplify uses the USER_SRP_AUTH flow by default - no extra config needed).
 *  - Custom attribute `is_admin` (String) with app-client READ permission, so
 *    it is exposed as the `custom:is_admin` claim in the ID token.
 *  - Dev convenience: enable auto-verify for email so users can sign in right
 *    after signup (otherwise `confirmSignup()` needs a verification UI).
 */
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolClientId,
      loginWith: { email: true },
    },
  },
});

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  /**
   * Method to register a new user in the Cognito user pool
   * @param user
   * @returns `{ needsConfirmation }` - true when Cognito requires the emailed code
   */
  async signup(user: User): Promise<any> {
    try {
      const email = (user.email || '').trim().toLowerCase();
      const { nextStep } = await signUp({
        username: email,
        password: user.password || '',
        options: {
          userAttributes: {
            email,
            given_name: user.first_name || '',
            family_name: user.last_name || '',
          },
        },
      });
      return { needsConfirmation: nextStep.signUpStep === 'CONFIRM_SIGN_UP' };
    } catch (err) {
      throw this.normalizeError(err);
    }
  }

  /**
   * Method to confirm a signup with the verification code Cognito emailed
   * @param email
   * @param code
   */
  async confirmSignup(email: string, code: string): Promise<any> {
    try {
      return await confirmSignUp({
        username: (email || '').trim().toLowerCase(),
        confirmationCode: (code || '').trim(),
      });
    } catch (err) {
      throw this.normalizeError(err);
    }
  }

  /**
   * Method to resend the signup verification code Cognito emails
   * @param email
   */
  async resendSignupCode(email: string): Promise<any> {
    try {
      return await resendSignUpCode({
        username: (email || '').trim().toLowerCase(),
      });
    } catch (err) {
      throw this.normalizeError(err);
    }
  }

  /**
   * Method to login a user and return the token set + user profile
   * @param email
   * @param password
   */
  async login(email: string, password: string): Promise<any> {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: (email || '').trim().toLowerCase(),
        password,
      });
      if (!isSignedIn) {
        if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
          throw new Error('Please verify your email address before signing in.');
        }
        throw new Error('Unable to sign in. Please try again.');
      }
      return this.buildSession(email);
    } catch (err) {
      throw this.normalizeError(err);
    }
  }

  /**
   * Method to force-refresh the current Cognito session
   */
  async refresh(): Promise<any> {
    try {
      await fetchAuthSession({ forceRefresh: true });
      return this.buildSession('');
    } catch (err) {
      throw this.normalizeError(err);
    }
  }

  /**
   * Method to sign the current user out of Cognito
   */
  async logout(): Promise<void> {
    await signOut();
  }

  /**
   * Method to read the verified claims of the current session
   */
  async me(): Promise<any> {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.payload || null;
  }

  /**
   * Method to build the token + user payload from the active session
   * @param email fallback when the attribute is not returned
   */
  private async buildSession(email: string): Promise<any> {
    const [session, attributes] = await Promise.all([
      fetchAuthSession(),
      fetchUserAttributes(),
    ]);
    const claims: any = session.tokens?.idToken?.payload || {};
    const user: User = {
      _id: attributes['sub'] || claims['sub'] || '',
      first_name: attributes['given_name'] || '',
      last_name: attributes['family_name'] || '',
      email: attributes['email'] || email,
      is_admin: this.toBoolean(claims['custom:is_admin']),
    };
    return {
      token: session.tokens?.idToken?.toString() || '',
      accessToken: session.tokens?.accessToken?.toString() || '',
      refreshToken: (session.tokens as any)?.refreshToken?.toString() || '',
      expiresIn:
        typeof claims.exp === 'number' && typeof claims.iat === 'number'
          ? claims.exp - claims.iat
          : 0,
      user,
    };
  }

  /**
   * Method to normalize Cognito error names into human readable messages
   * @param err
   */
  private normalizeError(err: any): any {
    const messages: Record<string, string> = {
      UserNotConfirmedException: 'Please verify your email address before signing in.',
      UserNotFoundException: 'Incorrect email or password.',
      NotAuthorizedException: 'Incorrect email or password.',
      UsernameExistsException: 'An account with this email already exists.',
      InvalidPasswordException: 'Your password does not meet the requirements.',
      CodeMismatchException: 'That verification code is not valid.',
      ExpiredCodeException: 'That verification code has expired. Request a new one.',
      TooManyRequestsException: 'Too many attempts. Please try again later.',
      LimitExceededException: 'Too many attempts. Please try again later.',
    };
    const message = messages[err?.name];
    if (!message) {
      return err;
    }
    const normalized = new Error(message);
    normalized.name = err.name;
    return normalized;
  }

  /**
   * Method to normalize a Cognito custom attribute value ("true"/"1") to boolean
   * @param value
   */
  private toBoolean(value: unknown): boolean {
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
