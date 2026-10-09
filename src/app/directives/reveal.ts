import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appReveal]',
})
export class Reveal {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const node = this.element.nativeElement;
      const media =
        typeof window.matchMedia === 'function'
          ? window.matchMedia('(prefers-reduced-motion: reduce)')
          : null;
      const reduce = media?.matches ?? false;

      if (reduce || typeof IntersectionObserver === 'undefined') {
        node.classList.add('is-in');
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            node.classList.add('is-in');
            observer.disconnect();
          }
        },
        { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
      );

      observer.observe(node);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
