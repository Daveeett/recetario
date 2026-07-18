export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}


