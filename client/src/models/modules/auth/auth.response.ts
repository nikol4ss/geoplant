import type { ApiResponse } from '@/types/api.type';

import type { User } from './auth.model';

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type LoginResponse = ApiResponse<LoginData>;
export type SignupResponse = ApiResponse<User>;
