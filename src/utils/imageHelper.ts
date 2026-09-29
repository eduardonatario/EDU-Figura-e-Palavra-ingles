/**
 * Image helper utilities: URL sanitization, validation, and resolution.
 */

export function resolveImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (typeof window !== 'undefined' && trimmed.startsWith('/')) {
    return window.location.origin + trimmed;
  }
  return trimmed;
}

export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}
