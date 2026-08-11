export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  password?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}
