import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { GalleryItem } from '../data/profile';
import { VideoEmbed } from './video-embed';

export interface OpenGallery {
  title: string;
  items: GalleryItem[];
  index: number;
  /** Enlace a la galería completa (Behance), si existe. */
  href?: string;
}

export interface LightboxLabels {
  close: string;
  previous: string;
  next: string;
  of: string;
  viewOnBehance: string;
  play: string;
}

@Component({
  selector: 'app-lightbox',
  imports: [VideoEmbed],
  template: `
    <dialog
      #dialog
      class="lightbox"
      [attr.aria-label]="gallery()?.title"
      (close)="closed.emit()"
      (click)="onBackdrop($event)"
      (keydown)="onKey($event)"
      (touchstart)="touchX = $event.changedTouches[0].clientX"
      (touchend)="onSwipe($event)"
    >
      @if (gallery(); as g) {
        <header class="lightbox-bar">
          <p class="lightbox-title">
            {{ g.title }}
            @if (g.items.length > 1) {
              <span>{{ index() + 1 }} {{ labels().of }} {{ g.items.length }}</span>
            }
          </p>
          <div class="lightbox-actions">
            @if (g.href) {
              <a class="lightbox-link" [href]="g.href" target="_blank" rel="noopener noreferrer">
                {{ labels().viewOnBehance }}
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            }
            <button
              type="button"
              class="icon-btn"
              (click)="close()"
              [attr.aria-label]="labels().close"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </header>

        <figure class="lightbox-stage">
          @if (item(); as current) {
            @if (current.youtube) {
              @for (key of [current.youtube]; track key) {
                <app-video-embed
                  [youtube]="current.youtube"
                  [poster]="current.src"
                  [title]="g.title"
                  [playLabel]="labels().play"
                />
              }
            } @else {
              <img [src]="current.src" alt="{{ g.title }} {{ index() + 1 }}" decoding="async" />
            }
          }
        </figure>

        @if (g.items.length > 1) {
          <button
            type="button"
            class="icon-btn lightbox-nav prev"
            (click)="step(-1)"
            [attr.aria-label]="labels().previous"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn lightbox-nav next"
            (click)="step(1)"
            [attr.aria-label]="labels().next"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <ol class="lightbox-thumbs">
            @for (thumb of g.items; track thumb.src; let i = $index) {
              <li>
                <button
                  type="button"
                  [class.is-active]="i === index()"
                  [attr.aria-current]="i === index() ? 'true' : null"
                  (click)="index.set(i)"
                >
                  <img [src]="thumb.src" alt="{{ i + 1 }}" decoding="async" />
                </button>
              </li>
            }
          </ol>
        }
      }
    </dialog>
  `,
})
export class Lightbox {
  readonly gallery = input<OpenGallery | null>(null);
  readonly labels = input.required<LightboxLabels>();
  readonly closed = output<void>();

  protected readonly index = signal(0);
  protected readonly item = computed(() => this.gallery()?.items[this.index()]);
  protected touchX = 0;

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const gallery = this.gallery();
      const dialog = this.dialog().nativeElement;
      if (gallery) {
        this.index.set(gallery.index);
        if (!dialog.open) {
          dialog.showModal();
        }
      } else if (dialog.open) {
        dialog.close();
      }
    });
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected step(delta: number): void {
    const count = this.gallery()?.items.length ?? 0;
    if (count > 1) {
      this.index.update((i) => (i + delta + count) % count);
    }
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.step(1);
    } else if (event.key === 'ArrowLeft') {
      this.step(-1);
    }
  }

  /** Un clic en el fondo oscuro (el propio <dialog>, fuera del contenido) cierra. */
  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }

  protected onSwipe(event: TouchEvent): void {
    const dx = event.changedTouches[0].clientX - this.touchX;
    if (Math.abs(dx) > 50) {
      this.step(dx < 0 ? 1 : -1);
    }
  }
}
