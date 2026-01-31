import { AppError } from '@/lib/error.lib.js';

export const AuthErrors = {
  INVALID_CREDENTIALS: () =>
    new AppError({
      code: 'INVALID_CREDENTIALS',
      statusCode: 401,
      message: 'Credenciais inválidas',
      advice: 'Verifique e-mail e senha.',
    }),

  USER_NOT_FOUND: () =>
    new AppError({
      code: 'USER_NOT_FOUND',
      statusCode: 404,
      message: 'Usuário não encontrado',
      advice: 'Verifique o e-mail informado.',
    }),

  USER_INACTIVE: () =>
    new AppError({
      code: 'USER_INACTIVE',
      statusCode: 403,
      message: 'Usuário inativo',
      advice: 'Contate o suporte.',
    }),

  USER_EXISTING: () =>
    new AppError({
      code: 'USER_EXISTING',
      statusCode: 409,
      message: 'Usuário já existe',
      advice: 'Este e-mail já está cadastrado.',
    }),

  RATE_LIMIT_EXCEEDED: () =>
    new AppError({
      code: 'RATE_LIMIT_EXCEEDED',
      statusCode: 429,
      message: 'Muitas tentativas',
      advice: 'Tente novamente em alguns minutos.',
    }),

  FORBIDDEN_FIELD: () =>
    new AppError({
      code: 'FORBIDDEN_FIELD',
      statusCode: 403,
      message: 'Campo não permitido',
      advice: 'Remova campos não autorizados do payload.',
    }),

  DATABASE_CONFLICT: () =>
    new AppError({
      code: 'DATABASE_CONFLICT',
      statusCode: 409,
      message: 'Conflito de dados',
      advice: 'Registro já existente.',
    }),

  CREATE_USER_FAILED: () =>
    new AppError({
      code: 'CREATE_USER_FAILED',
      statusCode: 500,
      message: 'Erro ao criar usuário',
      advice: 'Tente novamente mais tarde.',
    }),
};
