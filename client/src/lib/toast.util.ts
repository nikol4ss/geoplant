import { toast } from 'vue-sonner';

type ToastPromiseMessages<T = any> = {
  loading?: string;
  success?: string | ((data: T) => string);
  error?: string | ((err: any) => string);
};

export const Toast = {
  success(message: string) {
    toast.success(message);
  },

  error(message: string) {
    toast.error(message);
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
    } catch (err) {
      toast.error(
        typeof messages.error === 'function'
          ? messages.error(err)
          : (messages.error ?? 'Erro inesperado'),
        { id },
      );

      throw err;
    }
  },
};
