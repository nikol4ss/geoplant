import { api } from '@/api/axios.api';
import type { SignupPayload, SignupResponse } from '@/models/modules/auth/auth.model';

export const createUser = async (body: SignupPayload): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>('/auth/signup', body);

  return response.data;
};
