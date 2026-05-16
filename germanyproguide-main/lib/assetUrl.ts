/** Build-safe path for files in Vite `public/` (hero.mp4, serv*.png, etc.) */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = path.replace(/^\//, '');
  return `${base}${normalized}`;
}
