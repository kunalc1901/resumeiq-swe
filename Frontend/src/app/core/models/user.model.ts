/**
 * @author ResumeIQ
 */

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  /** Admin flag from the Cognito `custom:is_admin` claim (also stored on user profiles). */
  is_admin?: boolean;
  createdAt?: string;
  /** Subscription plan id ('free' | 'premium'). Populated by the backend once available. */
  plan?: string;
}