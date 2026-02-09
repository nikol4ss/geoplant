export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      message: string;
      advice?: string;
      errors?: unknown;
    };
