import { z } from 'zod';

export const Status = ['Active', 'Inactive'] as const;
export const Organization = ['None', 'Company', 'Institution'] as const;
export const Ocuppation = [
  'Admin',
  'Student',
  'Teacher',
  'Engineer',
  'Researcher',
  'Botanist',
] as const;

export interface SignupRequestBody {
  name: string;
  surname: string;
  email: string;
  password: string;
  organization_name?: string;
  organization: 'None' | 'Company' | 'Institution';
  occupation: 'Admin' | 'Student' | 'Teacher' | 'Engineer' | 'Researcher' | 'Botanist';
  status: 'Active' | 'Inactive';
}

export const UserSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome: mínimo 3 caracteres')
    .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, 'Nome: contém caracteres inválidos'),
  surname: z
    .string()
    .min(3, 'Sobrenome: mínimo 3 caracteres')
    .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, 'Sobrenome: contém caracteres inválidos'),

  organization: z.enum(Organization),
  organization_name: z.string().optional(),
  occupation: z.enum(Ocuppation),

  email: z
    .string()
    .min(1, 'E-mail: não pode estar vazio')
    .email({ message: 'E-mail: formato inválido' }),
  password: z
    .string()
    .min(6, 'Senha: mínimo 6 caracteres')
    .regex(
      /(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Senha: deve conter ao menos 1 número e 1 caractere especial',
    ),

  status: z.enum(Status).optional(),
});

export const SignupSchema = UserSchema;

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail: não pode estar vazio')
    .email({ message: 'E-mail: formato inválido' }),
  password: z.string().min(6, 'Senha: mínimo 6 caracteres'),
});

export type UserCreate = z.output<typeof SignupSchema>;
export type UserLogin = z.output<typeof LoginSchema>;
