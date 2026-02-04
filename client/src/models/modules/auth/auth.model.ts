import type { ApiResponse } from '@/models/api.model';

import type { Occupation, Organization, Status } from './enums.model';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;

  organization: Organization;
  organization_name?: string;

  occupation: Occupation;
  status: Status;

  createdAt: string;
  updatedAt: string;
}

export interface SignupPayload {
  name: string;
  surname: string;
  email: string;
  password: string;

  organization?: Organization;
  organization_name?: string;

  occupation?: Occupation;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenPayload {
  refreshToken: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type LoginResponse = ApiResponse<LoginData>;
export type SignupResponse = ApiResponse<User>;
