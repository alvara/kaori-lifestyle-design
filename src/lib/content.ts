// Loads the editable copy. Every visible string on the site lives in
// content/<lang>/<page>.yml so Pages CMS (see .pages.yml) can edit it
// without touching code. Files are read at build time only.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export type Lang = 'en' | 'ja';
export const LANGS: Lang[] = ['en', 'ja'];

export function load<T = any>(lang: Lang, page: string): T {
  const file = path.join(process.cwd(), 'content', lang, `${page}.yml`);
  return parse(fs.readFileSync(file, 'utf8')) as T;
}

/** Static paths for a page in both languages: EN at /, JA at /ja/. */
export function langPaths() {
  return [
    { params: { lang: undefined }, props: { lang: 'en' as Lang } },
    { params: { lang: 'ja' }, props: { lang: 'ja' as Lang } },
  ];
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Internal link for a route ("/", "/about") in the given language. */
export function href(route: string, lang: Lang): string {
  const prefix = lang === 'ja' ? '/ja' : '';
  const p = route === '/' ? (prefix ? `${prefix}/` : '/') : `${prefix}${route}`;
  return `${BASE}${p}`;
}

/** Public asset URL that respects the deploy base path. */
export function asset(p: string): string {
  return `${BASE}/${p.replace(/^\//, '')}`;
}

/** Split editor text into paragraphs (blank line) and lines (newline). */
export function paragraphs(text: string | undefined | null): string[][] {
  if (!text) return [];
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((p) => p.length);
}

/** A paragraph written as **text** renders as the highlighted concept line. */
export function conceptLine(lines: string[]): string | null {
  const m = lines.length === 1 && lines[0].match(/^\*\*(.+)\*\*$/);
  return m ? m[1] : null;
}
