import type { Occupation } from '@/models/modules/auth/enums.model';

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  occupation?: Occupation;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
