import type { Occupation, Organization } from './enums.model';

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
