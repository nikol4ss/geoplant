import { h } from 'vue';

import { toast } from 'vue-sonner';

type AxiosErrorLike = {
  response?: {
    data?: any;
  };
};

function isAxiosError(err: unknown): err is AxiosErrorLike {
  return typeof err === 'object' && err !== null && 'response' in err;
}

type ToastPromiseMessages<T = any> = {
  loading?: string;
  success?: string | ((data: T) => string);
  error?: string | ((err: unknown) => string | string[]);
};

export function parseApiError(err: unknown): string[] {
  if (isAxiosError(err)) {
    const { data } = err.response ?? {};
    const output: string[] = [];

    // Zod
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      data.errors.forEach((e: any) => {
        output.push(`${e.message}\n Campos inválidos. Tente novamente.`);
      });
      return output;
    }

    // Fastfy
    if (data?.message) {
      output.push(`${data.message}${data.advice ? `\n${data.advice}` : ''}`);
      return output;
    }

    return ['Erro inesperado'];
  }

  if (err instanceof Error) return [err.message];
  return ['Erro inesperado'];
}

function toastError(message: string) {
  toast.error({
    render() {
      const lines = message.split('\n');

      return h(
        'div',
        { class: 'flex flex-col gap-1' },
        lines.map((line) => h('div', line)),
      );
    },
  });
}

export const Toast = {
  success(message: string) {
    toast.success(message);
  },

  error(message: string | string[]) {
    const messages = Array.isArray(message) ? message : [message];
    messages.forEach((msg) => toastError(msg));
  },

  warning(message: string) {
    toast.warning(message);
  },

  info(message: string) {
    toast(message);
  },

  async promise<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>): Promise<T> {
    const id = toast.loading(messages.loading ?? 'Carregando');

    try {
      const data = await promise;

      toast.success(
        typeof messages.success === 'function'
          ? messages.success(data)
          : (messages.success ?? 'Sucesso'),
        { id },
      );

      return data;
    } catch (err: unknown) {
      let errors: string[] = [];

      if (typeof messages.error === 'function') {
        const result = messages.error(err);
        errors = Array.isArray(result) ? result : [result];
      } else if (messages.error) {
        errors = Array.isArray(messages.error) ? messages.error : [messages.error];
      } else {
        errors = parseApiError(err);
      }

      errors.forEach((msg) => toastError(msg));

      throw err;
    } finally {
      toast.dismiss(id);
    }
  },
};
