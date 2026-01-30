export class AppError extends Error {
  code: string;
  statusCode: number;
  advice?: string;

  constructor({
    code,
    statusCode,
    message,
    advice,
  }: {
    code: string;
    statusCode: number;
    message: string;
    advice?: string;
  }) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.advice = advice;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      advice: this.advice,
    };
  }
}

export const createError = (code: string, options: { statusCode: number; message: string | ((...args: any[]) => string); advice?: string }) => {
  return (...args: any[]) => {
    const message = typeof options.message === 'function' ? options.message(...args) : options.message;
    return new AppError({
      code,
      statusCode: options.statusCode,
      message,
      advice: options.advice,
    });
  };
};
