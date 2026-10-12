import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { content, Lang } from './data/profile';

export type Theme = 'dark' | 'light';

const LANG_KEY = 'lang';
const THEME_KEY = 'theme';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Sin almacenamiento (modo privado, etc.): la preferencia solo dura esta visita.
  }
}

/**
 * Idioma y tema de la página. El idioma sale de `?lang=` en la URL, luego de lo que
 * eligió el visitante y por último del navegador; así se puede compartir un enlace
 * directo a la versión en inglés.
 */
@Injectable({ providedIn: 'root' })
export class Preferences {
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<Lang>(this.initialLang());
  readonly theme = signal<Theme>(read(THEME_KEY) === 'light' ? 'light' : 'dark');
  readonly content = computed(() => content[this.lang()]);

  constructor() {
    effect(() => {
      const lang = this.lang();
      const { meta } = this.content();
      const root = this.document.documentElement;
      root.lang = lang;
      this.document.title = meta.title;
      this.document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', meta.description);
    });

    effect(() => {
      const theme = this.theme();
      this.document.documentElement.dataset['theme'] = theme;
      this.document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'light' ? '#f6f3ec' : '#090c11');
    });
  }

  toggleLang(): void {
    const next: Lang = this.lang() === 'es' ? 'en' : 'es';
    this.lang.set(next);
    write(LANG_KEY, next);

    // Mantiene la URL compartible sin recargar la página.
    const url = new URL(this.document.location.href);
    url.searchParams.set('lang', next);
    history.replaceState(history.state, '', url);
  }

  toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    write(THEME_KEY, next);
  }

  private initialLang(): Lang {
    const fromUrl = new URLSearchParams(this.document.location.search).get('lang');
    if (fromUrl === 'es' || fromUrl === 'en') {
      return fromUrl;
    }

    const saved = read(LANG_KEY);
    if (saved === 'es' || saved === 'en') {
      return saved;
    }

    return (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
  }
}
