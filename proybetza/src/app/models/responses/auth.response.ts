import type { User } from '../user.model';

export interface AuthResponse {
  user: User;
  token: string;
}
