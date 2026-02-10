export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
