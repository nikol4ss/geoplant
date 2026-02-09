export type ToastPromiseMessages<T = any> = {
  loading?: string;
  success?: string | ((data: T) => string | { message: string; advice?: string });
  error?: string | ((err: unknown) => string | string[] | { message: string; advice?: string });
};
