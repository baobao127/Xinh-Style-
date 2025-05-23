export function handleError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Đã xảy ra lỗi không xác định.';
}