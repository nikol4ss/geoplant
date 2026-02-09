import { api } from '@/api/axios.api';
import type { LoginPayload, SignupPayload, TokenPayload } from '@/models/modules/auth/auth.dto';
import type { LoginResponse, SignupResponse } from '@/models/modules/auth/auth.response';

export const createUser = async (body: SignupPayload): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>('/auth/signup', body);
  return response.data;
};

export const authenticateUser = async (body: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', body);
  return response.data;
};

export const refreshUser = async (body: TokenPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/refresh', body);
  return response.data;
};
