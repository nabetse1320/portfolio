import { Directive } from '@angular/core';

@Directive({
  selector: '[appSpotlight]',
  host: {
    '(pointermove)': 'onMove($event)',
  },
})
export class Spotlight {
  protected onMove(event: PointerEvent): void {
    const node = event.currentTarget as HTMLElement | null;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
