export const TOKEN_STORAGE_KEY = 'access_token';
export const ACCESS_TOKEN_STORAGE_KEY = 'cognito_access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'cognito_refresh_token';
export const USER_STORAGE_KEY = 'logged_in_user';

export const MESSAGES = {
  ERROR: {
    LOGIN_FAILED: 'Invalid email or password.',
    SIGNUP_FAILED: 'We could not create your account. Please try again.',
    VERIFICATION_FAILED: 'That code is not valid or has expired. Please try again.',
    RESEND_FAILED: 'We could not send a new code. Please try again.',
    DEFAULT: 'Something unexpected occurred!',
  },
  SUCCESS: {
    LOGIN: 'Login successful.',
  },
};

// URLs that skip the auth guard (already handled by routing config, kept for clarity)
export const PUBLIC_URLS = ['/login'];