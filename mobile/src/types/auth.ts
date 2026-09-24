export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  profile_image?: string | null;
  created_at?: string; 
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}