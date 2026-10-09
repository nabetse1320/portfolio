import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

interface PlexusNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  gold: boolean;
}

@Directive({
  selector: 'canvas[appPlexus]',
})
export class Plexus {
  private readonly canvasRef = inject(ElementRef<HTMLCanvasElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.start());
  }

  private start(): void {
    const canvas = this.canvasRef.nativeElement;
    const host = canvas.parentElement;
    const context = canvas.getContext('2d');
    if (!host || !context) {
      return;
    }

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let nodes: PlexusNode[] = [];
    let frame = 0;
    let running = false;
    let visible = true;
    let lastTime = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const resize = (): void => {
      const nextWidth = host.clientWidth;
      const nextHeight = host.clientHeight;
      if (nextWidth < 2 || nextHeight < 2) {
        return;
      }

      const previousWidth = width || nextWidth;
      const previousHeight = height || nextHeight;
      width = nextWidth;
      height = nextHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = nodeCount(width, height);
      if (nodes.length === 0 || Math.abs(nodes.length - target) > 10) {
        nodes = Array.from({ length: target }, () => createNode(width, height));
        return;
      }

      const scaleX = width / previousWidth;
      const scaleY = height / previousHeight;
      for (const node of nodes) {
        node.x *= scaleX;
        node.y *= scaleY;
      }
    };

    const draw = (dt: number): void => {
      context.clearRect(0, 0, width, height);
      if (!reduce) {
        for (const node of nodes) {
          node.x += node.vx * dt;
          node.y += node.vy * dt;
          if (node.x <= 0 || node.x >= width) {
            node.vx *= -1;
            node.x = Math.min(width, Math.max(0, node.x));
          }
          if (node.y <= 0 || node.y >= height) {
            node.vy *= -1;
            node.y = Math.min(height, Math.max(0, node.y));
          }
        }
      }

      const reach = Math.min(168, Math.max(118, width * 0.13));
      const reachSq = reach * reach;
      context.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= reachSq) {
            continue;
          }
          const alpha = (1 - Math.sqrt(distSq) / reach) * 0.55;
          context.strokeStyle = `rgba(94, 234, 212, ${alpha})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }

        if (pointer.active) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          const pointerReach = reach * 1.15;
          if (distSq < pointerReach * pointerReach) {
            const alpha = (1 - Math.sqrt(distSq) / pointerReach) * 0.7;
            context.strokeStyle = `rgba(231, 194, 122, ${alpha})`;
            context.beginPath();
            context.moveTo(pointer.x, pointer.y);
            context.lineTo(a.x, a.y);
            context.stroke();
          }
        }
      }

      for (const node of nodes) {
        context.fillStyle = node.gold ? 'rgba(231, 194, 122, 0.9)' : 'rgba(94, 234, 212, 0.85)';
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const loop = (now: number): void => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) {
        lastTime = now;
        return;
      }
      const dt = Math.min(2, (now - lastTime) / 16.67) || 1;
      lastTime = now;
      draw(dt);
    };

    const startLoop = (): void => {
      if (running || reduce) {
        return;
      }
      running = true;
      lastTime = performance.now();
      frame = requestAnimationFrame(loop);
    };

    const stopLoop = (): void => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = (): void => {
      pointer.active = false;
    };

    const onVisibility = (): void => {
      if (document.hidden) {
        stopLoop();
        return;
      }
      startLoop();
    };

    resize();
    draw(0);

    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => resize());
      observer.observe(host);
    }

    let intersection: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          startLoop();
          return;
        }
        stopLoop();
      });
      intersection.observe(host);
    }

    startLoop();

    this.destroyRef.onDestroy(() => {
      stopLoop();
      observer?.disconnect();
      intersection?.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }
}

function nodeCount(width: number, height: number): number {
  return Math.max(28, Math.min(90, Math.round((width * height) / 17000)));
}

function createNode(width: number, height: number): PlexusNode {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.16 + Math.random() * 0.34;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: Math.random() > 0.82 ? 2.2 : 1.4,
    gold: Math.random() > 0.84,
  };
}
