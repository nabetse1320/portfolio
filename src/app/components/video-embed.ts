import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Miniatura de un video de YouTube que solo carga el reproductor al hacer clic,
 * para no pagar el peso de varios iframes al cargar la página.
 */
@Component({
  selector: 'app-video-embed',
  template: `
    @if (playing()) {
      <iframe
        [src]="src()"
        [title]="title()"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    } @else {
      <button type="button" class="video-poster" (click)="playing.set(true)">
        <img [src]="poster()" alt="" width="960" height="540" loading="lazy" decoding="async" />
        <span class="play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
        </span>
        <span class="sr-only">{{ playLabel() }} {{ title() }}</span>
      </button>
    }
  `,
  host: { class: 'video-embed' },
})
export class VideoEmbed {
  readonly youtube = input.required<string>();
  readonly poster = input.required<string>();
  readonly title = input.required<string>();
  readonly playLabel = input('Reproducir video de');

  protected readonly playing = signal(false);

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly src = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.youtube())}?autoplay=1&rel=0`,
    ),
  );
}
