import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { navigation, profile } from './data/profile';
import { Reveal } from './directives/reveal';
import { Spotlight } from './directives/spotlight';

@Component({
  selector: 'app-root',
  imports: [Reveal, Spotlight],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly profile = profile;
  protected readonly navigation = navigation;
  protected readonly year = new Date().getFullYear();
  protected readonly marqueeLoop = [...profile.marquee, ...profile.marquee];
  protected readonly emailParts = profile.email.split('@');
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly active = signal('inicio');
  protected readonly progress = signal(0);

  private readonly destroyRef = inject(DestroyRef);
  private readonly sectionIds = ['inicio', ...navigation.map((item) => item.id)];

  constructor() {
    afterNextRender(() => {
      const onScroll = () => this.syncScroll();
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

  private setMenu(open: boolean): void {
    this.menuOpen.set(open);
    document.documentElement.classList.toggle('menu-lock', open);
  }

  private syncScroll(): void {
    this.scrolled.set(window.scrollY > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? Math.min(window.scrollY / max, 1) : 0);

    const line = window.innerHeight * 0.32;
    let current = this.sectionIds[0];

    for (const id of this.sectionIds) {
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
