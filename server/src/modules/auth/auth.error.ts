import { AppError } from '@/lib/error.lib.js';

export const AuthErrors = {
  Auth: {
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
        advice: 'Remova campos não autorizados.',
      }),

    REFRESH_TOKEN_REQUIRED: () =>
      new AppError({
        code: 'REFRESH_TOKEN_REQUIRED',
        statusCode: 400,
        message: 'Refresh token obrigatório',
        advice: 'Informe o refresh token na requisição.',
      }),

    INVALID_REFRESH_TOKEN: () =>
      new AppError({
        code: 'INVALID_REFRESH_TOKEN',
        statusCode: 401,
        message: 'Refresh token inválido',
        advice: 'Token fornecido é inválido ou expirou.',
      }),

    TOKEN_GENERATION_FAILED: () =>
      new AppError({
        code: 'TOKEN_GENERATION_FAILED',
        statusCode: 500,
        message: 'Falha ao gerar token',
        advice: 'Tente novamente mais tarde.',
      }),

    CREATE_USER_FAILED: () =>
      new AppError({
        code: 'CREATE_USER_FAILED',
        statusCode: 500,
        message: 'Erro ao criar usuário',
        advice: 'Tente novamente mais tarde.',
      }),
  },

  Prisma: {
    UNIQUE_CONSTRAINT: () =>
      new AppError({
        code: 'PRISMA_UNIQUE_CONSTRAINT',
        statusCode: 409,
        message: 'Registro já existente',
        advice: 'Os dados informados violam uma regra de unicidade.',
      }),

    FOREIGN_KEY_CONFLICT: () =>
      new AppError({
        code: 'PRISMA_FOREIGN_KEY_CONFLICT',
        statusCode: 409,
        message: 'Referência inválida',
        advice: 'Verifique os dados relacionados informados.',
      }),

    CONSTRAINT_VIOLATION: () =>
      new AppError({
        code: 'PRISMA_CONSTRAINT_VIOLATION',
        statusCode: 400,
        message: 'Regra de dados violada',
        advice: 'Verifique os valores enviados.',
      }),

    DATABASE_ERROR: (prismaCode?: string) =>
      new AppError({
        code: 'PRISMA_DATABASE_ERROR',
        statusCode: 500,
        message: 'Erro interno de banco de dados',
        advice: prismaCode ? `Erro Prisma: ${prismaCode}` : 'Tente novamente mais tarde.',
      }),
  },
};
