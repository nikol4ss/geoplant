import { z } from 'zod';

export const Status = ['Active', 'Inactive'] as const;
export const Organization = ['None', 'Company', 'Institution'] as const;
export const Occupation = [
  'Admin',
  'Student',
  'Teacher',
  'Engineer',
  'Researcher',
  'Botanist',
] as const;

export interface JwtPayload {
  id: number;
}

export const UserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Nome: campo obrigatório')
      .min(3, 'Nome: mínimo 3 caracteres')
      .max(20, 'Nome: máximo 20 caracteres')
      .regex(/^[A-Za-zÀ-ÿ]+$/, 'Nome: use apenas letras'),

    surname: z
      .string()
      .trim()
      .min(1, 'Sobrenome: campo obrigatório')
      .min(3, 'Sobrenome: mínimo 3 caracteres')
      .max(20, 'Sobrenome: máximo 20 caracteres')
      .regex(/^[A-Za-zÀ-ÿ]+$/, 'Sobrenome: use apenas letras'),

    organization: z.enum(Organization),

    organization_name: z
      .string()
      .trim()
      .min(2, 'Organização: mínimo 2 caracteres')
      .max(30, 'Organização: máximo 30 caracteres')
      .regex(
        /^[A-Za-zÀ-ÿ0-9]+([ .,'&()-][A-Za-zÀ-ÿ0-9]+)*$/,
        'Organização: contém caracteres inválidos',
      )
      .optional(),

    occupation: z.enum(Occupation),

    email: z
      .string()
      .trim()
      .min(1, 'E-mail: campo obrigatório')
      .max(254, 'E-mail: muito longo')
      .email('E-mail: formato inválido'),

    password: z
      .string()
      .min(8, 'Senha: mínimo 8 caracteres')
      .regex(/^\S+$/, 'Senha: não pode conter espaços')
      .regex(/[0-9]/, 'Senha: deve conter 1 número')
      .regex(/[!@#$%^&*]/, 'Senha: deve conter 1 caractere especial')
      .regex(/[A-Z]/, 'Senha: deve conter 1 letra maiúscula')
      .regex(/[a-z]/, 'Senha: deve conter 1 letra minúscula'),

    status: z.enum(Status).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.organization !== 'None' && !data.organization_name) {
      ctx.addIssue({
        path: ['organization_name'],
        message: 'Organização: campo obrigatório',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.organization === 'None' && data.organization_name) {
      ctx.addIssue({
        path: ['organization_name'],
        message: 'Organização: não deve ser informada',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const SignupSchema = UserSchema;

export const LoginSchema = z.object({
  email: z.string().trim().min(1, 'E-mail: campo obrigatório').email('E-mail: formato inválido'),

  password: z.string().min(1, 'Senha: campo obrigatório'),
});

export type UserCreate = z.output<typeof SignupSchema>;
export type UserLogin = z.output<typeof LoginSchema>;
