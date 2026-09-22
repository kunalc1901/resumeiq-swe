/**
 * @author ResumeIQ
 */

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: string;
  createdAt?: string;
}