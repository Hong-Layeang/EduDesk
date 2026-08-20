/**
 * Generates a deterministic avatar for a person based on their name,
 * so we show a real image instead of a generic icon without depending
 * on the user having uploaded a photo.
 */
export function getAvatarUrl(name: string): string {
  const params = new URLSearchParams({
    name,
    background: '2563eb',
    color: 'ffffff',
    size: '128',
    bold: 'true',
  });

  return `https://ui-avatars.com/api/?${params.toString()}`;
}