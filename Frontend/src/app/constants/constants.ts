export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  PUBLIC: 'public',
};

export const TOKEN_STORAGE_KEY = 'access_token';
export const USER_STORAGE_KEY = 'logged_in_user';

export const MESSAGES = {
  ERROR: {
    LOGIN_FAILED: 'Invalid email or password.',
    DEFAULT: 'Something unexpected occurred!',
  },
  SUCCESS: {
    LOGIN: 'Login successful.',
  },
};

// URLs that skip the auth guard (already handled by routing config, kept for clarity)
export const PUBLIC_URLS = ['/login'];