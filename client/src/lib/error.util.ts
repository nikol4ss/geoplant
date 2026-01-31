export function parseApiError(err: any): string {
  const status = err?.response?.status;
  const data = err?.response?.data;

  let output: string[] = [];

  if (status) {
    output.push(`Status: ${status}`);
  }

  if (!data) {
    output.push('Erro inesperado');
    return output.join('\n');
  }

  if (data.message) {
    output.push(`Mensagem: ${data.message}`);
  }

  if (data.advice) {
    output.push(`Dica: ${data.advice}`);
  }

  if (Array.isArray(data.errors)) {
    data.errors.forEach((e: any) => {
      const field = e.path?.join('.') ?? 'campo';
      output.push(`${field}: ${e.message}`);
    });
  }

  return output.join('\n');
}
