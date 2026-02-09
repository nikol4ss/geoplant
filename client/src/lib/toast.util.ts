import { h } from 'vue';

import { toast } from 'vue-sonner';

import type { ToastPromiseMessages } from '@/types/toast.type';

import { parseApiError } from '@/utils/parseApiError.util';

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

function toastSuccess(message: string, advice?: string) {
  toast.success({
    render() {
      const lines = [message];
      if (advice) lines.push(advice);
      return h(
        'div',
        { class: 'flex flex-col gap-1' },
        lines.map((line) => h('div', line)),
      );
    },
  });
}

export const Toast = {
  success(message: string, advice?: string) {
    toastSuccess(message, advice);
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

      let successMessage = 'Sucesso';
      let adviceMessage: string | undefined;

      if (typeof messages.success === 'function') {
        const result = messages.success(data);

        if (typeof result === 'string') {
          const parts = result.split('\n');
          successMessage = parts[0] || 'Sucesso';
          adviceMessage = parts[1];
        } else {
          successMessage = result.message;
          adviceMessage = result.advice;
        }
      } else if (typeof messages.success === 'string') {
        const parts = messages.success.split('\n');
        successMessage = parts[0] || 'Sucesso';
        adviceMessage = parts[1];
      }

      toastSuccess(successMessage, adviceMessage);
      toast.dismiss(id);

      return data;
    } catch (err: unknown) {
      let errors: string[] = [];

      if (typeof messages.error === 'function') {
        const result = messages.error(err);
        if (typeof result === 'string') errors = [result];
        else if (Array.isArray(result)) errors = result;
        else errors = [`${result.message}${result.advice ? `\n${result.advice}` : ''}`];
      } else if (messages.error) {
        if (Array.isArray(messages.error)) errors = messages.error;
        else errors = [messages.error];
      } else {
        errors = parseApiError(err);
      }

      errors.forEach((msg) => toastError(msg));
      toast.dismiss(id);

      throw err;
    }
  },
};
