import type { AxiosErrorLike } from '@/types/axios.type';

function isAxiosError(err: unknown): err is AxiosErrorLike {
  return typeof err === 'object' && err !== null && 'response' in err;
}

export function parseApiError(err: unknown): string[] {
  if (isAxiosError(err)) {
    const { data } = err.response ?? {};
    const output: string[] = [];

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      data.errors.forEach((e: any) => {
        output.push(`${e.message}\n Campos inválidos. Tente novamente.`);
      });
      return output;
    }

    if (data?.message) {
      output.push(`${data.message}${data.advice ? `\n${data.advice}` : ''}`);
      return output;
    }

    return ['Erro inesperado'];
  }

  if (err instanceof Error) return [err.message];
  return ['Erro inesperado'];
}
