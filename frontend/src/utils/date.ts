export function todayISODate(): string {
  return new Date().toISOString().split('T')[0];
}
