import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Lightbox, OpenGallery } from './components/lightbox';
import { VideoEmbed } from './components/video-embed';
import { CreativeItem, profile, Project } from './data/profile';
import { Plexus } from './directives/plexus';
import { Reveal } from './directives/reveal';
import { Spotlight } from './directives/spotlight';
import { Preferences } from './preferences';

@Component({
  selector: 'app-root',
  imports: [Plexus, Reveal, Spotlight, VideoEmbed, Lightbox],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly prefs = inject(Preferences);
  protected readonly c = this.prefs.content;
  protected readonly profile = profile;
  protected readonly year = new Date().getFullYear();
  protected readonly emailParts = profile.email.split('@');
  /**
   * Columnas de vidrio del retrato: posición (l) y ancho (w) en % del contenedor,
   * alto (h) en %, desplazamiento de la refracción (s) en % del ancho y orden
   * de apilado (z): las del centro quedan delante.
   */
  protected readonly slices = [
    { l: 0, w: 9, h: 58, s: -22, z: 1 },
    { l: 9, w: 10, h: 70, s: -15, z: 2 },
    { l: 19, w: 11, h: 82, s: -8, z: 3 },
    { l: 30, w: 40, h: 94, s: 0, z: 4 },
    { l: 70, w: 11, h: 82, s: 8, z: 3 },
    { l: 81, w: 10, h: 70, s: 15, z: 2 },
    { l: 91, w: 9, h: 58, s: 22, z: 1 },
  ];
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly active = signal('inicio');
  protected readonly progress = signal(0);
  protected readonly copied = signal(false);
  protected readonly gallery = signal<OpenGallery | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private readonly sectionIds = computed(() => ['inicio', ...this.c().nav.map((item) => item.id)]);
  private copiedTimer?: ReturnType<typeof setTimeout>;
  private scrollFrame = 0;

  constructor() {
    afterNextRender(() => {
      const onScroll = () => {
        if (!this.scrollFrame) {
          this.scrollFrame = requestAnimationFrame(() => {
            this.scrollFrame = 0;
            this.syncScroll();
          });
        }
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.setMenu(false);
        }
      };
      const onResize = () => {
        if (window.innerWidth > 1040) {
          this.setMenu(false);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('keydown', onKey);
      window.addEventListener('resize', onResize);
      this.syncScroll();

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(this.scrollFrame);
        clearTimeout(this.copiedTimer);
        document.documentElement.classList.remove('menu-lock');
      });
    });
  }

  protected toggleMenu(): void {
    this.setMenu(!this.menuOpen());
  }

  protected closeMenu(): void {
    this.setMenu(false);
  }

  protected openScreens(project: Project, index: number): void {
    this.gallery.set({
      title: project.name,
      items: (project.screens ?? []).map((src) => ({ src })),
      index,
    });
  }

  protected openCreative(item: CreativeItem, event: MouseEvent): void {
    if (!item.gallery?.length) {
      return; // Sin galería: el enlace abre Behance.
    }
    event.preventDefault();
    this.gallery.set({ title: item.title, items: item.gallery, index: 0, href: item.href });
  }

  /**
   * Suma media vuelta a una columna del retrato, en el sentido en que se mueve
   * el cursor. Si ya estaba girando, la transición continúa desde el ángulo
   * actual, así que ningún hover se pierde.
   */
  protected spinSlice(event: PointerEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const slice = event.currentTarget as HTMLElement;
    const direction = event.movementX < 0 ? -1 : 1;
    const turns = Number(slice.dataset['turns'] ?? 0) + direction;
    slice.dataset['turns'] = String(turns);
    slice.style.setProperty('--spin', `${turns * 180}deg`);
  }

  /** Mientras gira, la columna pasa por delante de sus vecinas. */
  protected onSpinStart(event: TransitionEvent): void {
    if (event.propertyName === '--spin') {
      (event.currentTarget as HTMLElement).classList.add('is-spinning');
    }
  }

  protected onSpinEnd(event: TransitionEvent): void {
    if (event.propertyName === '--spin' && event.target === event.currentTarget) {
      (event.currentTarget as HTMLElement).classList.remove('is-spinning');
    }
  }

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      window.location.href = profile.emailHref;
      return;
    }
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), 2000);
  }

  private setMenu(open: boolean): void {
    this.menuOpen.set(open);
    document.documentElement.classList.toggle('menu-lock', open);
  }

  private syncScroll(): void {
    this.scrolled.set(window.scrollY > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? Math.min(window.scrollY / max, 1) : 0);

    // Los nodos del fondo se atenúan al dejar la portada, para no competir con el texto.
    const dim = Math.min(window.scrollY / window.innerHeight, 1);
    document.documentElement.style.setProperty('--nodes-opacity', (1 - dim * 0.45).toFixed(3));

    const line = window.innerHeight * 0.32;
    const ids = this.sectionIds();
    let current = ids[0];

    for (const id of ids) {
      const section = document.getElementById(id);
      if (!section) {
        continue;
      }

      const rect = section.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) {
        current = id;
      }
    }

    this.active.set(current);
  }
}
