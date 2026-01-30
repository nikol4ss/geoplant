import { AppError } from '@/lib/error.lib.js';

export const AuthErrors = {
  EMAIL_INVALID: () =>
    new AppError({
      code: 'EMAIL_INVALID',
      statusCode: 401,
      message: 'Credenciais inválidas',
      advice: 'Verifique seu e-mail e senha.',
    }),

  PASSWORD_INVALID: () =>
    new AppError({
      code: 'PASSWORD_INVALID',
      statusCode: 401,
      message: 'Credenciais inválidas',
      advice: 'Verifique seu e-mail e senha.',
    }),

  USER_NOT_FOUND: (email?: string) =>
    new AppError({
      code: 'USER_NOT_FOUND',
      statusCode: 404,
      message: 'Usuário não encontrado',
      advice: 'Verifique o e-mail ou ID informado.',
    }),

  USER_INACTIVE: () =>
    new AppError({
      code: 'USER_INACTIVE',
      statusCode: 403,
      message: 'Usuário inativo',
      advice: 'Contate o suporte para reativação.',
    }),

  CREATE_USER_FAILED: () =>
    new AppError({
      code: 'CREATE_USER_FAILED',
      statusCode: 500,
      message: 'Erro ao criar usuário',
      advice: 'Tente novamente mais tarde.',
    }),

  USER_EXISTING: (email?: string) =>
    new AppError({
      code: 'USER_EXISTING',
      statusCode: 409,
      message: 'Usuário já existe',
      advice: 'Este e-mail já está cadastrado.',
    }),
};
