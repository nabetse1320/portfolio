import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

interface PlexusNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  gold: boolean;
  /** Profundidad 0.35 (lejos) – 1 (cerca): escala tamaño, brillo, velocidad y parallax. */
  z: number;
}

/** Un punto de luz que recorre un enlace de `from` a `to`. */
interface Pulse {
  from: number;
  to: number;
  t: number;
  speed: number;
  gold: boolean;
}

const LENS_RADIUS = 150;
const LENS_PUSH = 26;
const PARALLAX = 22;

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
    const pointer = { x: -9999, y: -9999, active: false, mouse: false };
    // Posiciones dibujadas (física + parallax + lente), recalculadas cada frame.
    let drawX = new Float32Array(0);
    let drawY = new Float32Array(0);
    // Enlaces visibles del último frame, como pares de índices [a0, b0, a1, b1, ...].
    let links: number[] = [];
    let pulses: Pulse[] = [];
    let spawnClock = 0;
    const parallax = { x: 0, y: 0 };
    let touchPointerId: number | null = null;
    let lastClientX = 0;
    let lastClientY = 0;
    // Colores "r, g, b" del tema actual (--teal-rgb / --gold-rgb en styles.scss).
    let teal = '94, 234, 212';
    let gold = '231, 194, 122';

    const readColors = (): void => {
      const style = getComputedStyle(canvas);
      teal = style.getPropertyValue('--teal-rgb').trim() || teal;
      gold = style.getPropertyValue('--gold-rgb').trim() || gold;
    };

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
        pulses = [];
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
      // The page scroll moves this canvas. Re-read the finger each frame so the
      // anchor stays on the screen point being pressed while the nodes scroll past.
      if (touchPointerId !== null) {
        updateFromClient(lastClientX, lastClientY);
      }
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

      // Parallax suave hacia el ratón: los nodos cercanos se mueven más que los lejanos.
      const targetX = pointer.active && pointer.mouse ? pointer.x / width - 0.5 : 0;
      const targetY = pointer.active && pointer.mouse ? pointer.y / height - 0.5 : 0;
      const ease = reduce ? 1 : Math.min(1, 0.06 * dt);
      parallax.x += (targetX - parallax.x) * ease;
      parallax.y += (targetY - parallax.y) * ease;

      if (drawX.length !== nodes.length) {
        drawX = new Float32Array(nodes.length);
        drawY = new Float32Array(nodes.length);
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        let x = node.x - parallax.x * PARALLAX * node.z;
        let y = node.y - parallax.y * PARALLAX * node.z;
        // Lente: el cursor aparta los nodos cercanos sin alterar su movimiento.
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0.01 && dist < LENS_RADIUS) {
            const push = (1 - dist / LENS_RADIUS) ** 2 * LENS_PUSH * node.z;
            x += (dx / dist) * push;
            y += (dy / dist) * push;
          }
        }
        drawX[i] = x;
        drawY[i] = y;
      }

      const reach = Math.min(168, Math.max(118, width * 0.13));
      const reachSq = reach * reach;
      const lensSq = LENS_RADIUS * LENS_RADIUS * 1.6;
      context.lineWidth = 1;
      links = [];

      for (let i = 0; i < nodes.length; i++) {
        const ax = drawX[i];
        const ay = drawY[i];
        const az = nodes[i].z;
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = ax - drawX[j];
          const dy = ay - drawY[j];
          const distSq = dx * dx + dy * dy;
          if (distSq >= reachSq) {
            continue;
          }
          links.push(i, j);
          let alpha = (1 - Math.sqrt(distSq) / reach) * 0.56 * Math.min(az, nodes[j].z);
          // Los enlaces cerca del cursor se iluminan.
          if (pointer.active) {
            const mx = (ax + drawX[j]) / 2 - pointer.x;
            const my = (ay + drawY[j]) / 2 - pointer.y;
            const m = mx * mx + my * my;
            if (m < lensSq) {
              alpha *= 1 + (1 - m / lensSq) * 1.8;
            }
          }
          context.strokeStyle = `rgba(${teal}, ${alpha})`;
          context.beginPath();
          context.moveTo(ax, ay);
          context.lineTo(drawX[j], drawY[j]);
          context.stroke();
        }

        if (pointer.active) {
          const dx = ax - pointer.x;
          const dy = ay - pointer.y;
          const distSq = dx * dx + dy * dy;
          const pointerReach = reach * 1.15;
          if (distSq < pointerReach * pointerReach) {
            const alpha = (1 - Math.sqrt(distSq) / pointerReach) * 0.6 * az;
            context.strokeStyle = `rgba(${gold}, ${alpha})`;
            context.beginPath();
            context.moveTo(pointer.x, pointer.y);
            context.lineTo(ax, ay);
            context.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const color = node.gold ? gold : teal;
        const r = node.radius * (0.6 + node.z * 0.6);
        // Halo tenue en los nodos cercanos para dar profundidad.
        if (node.z > 0.75) {
          context.fillStyle = `rgba(${color}, ${0.07 * node.z})`;
          context.beginPath();
          context.arc(drawX[i], drawY[i], r * 4, 0, Math.PI * 2);
          context.fill();
        }
        context.fillStyle = `rgba(${color}, ${0.3 + node.z * 0.5})`;
        context.beginPath();
        context.arc(drawX[i], drawY[i], r, 0, Math.PI * 2);
        context.fill();
      }

      if (!reduce) {
        drawPulses(dt, reachSq);
      }
    };

    /** Pulsos de luz que viajan por los enlaces y a veces siguen al siguiente nodo. */
    const drawPulses = (dt: number, reachSq: number): void => {
      const maxPulses = width < 700 ? 3 : 7;
      spawnClock += dt;
      if (spawnClock > 22 && pulses.length < maxPulses && links.length) {
        spawnClock = 0;
        const k = Math.floor(Math.random() * (links.length / 2)) * 2;
        const flip = Math.random() < 0.5;
        pulses.push({
          from: links[flip ? k : k + 1],
          to: links[flip ? k + 1 : k],
          t: 0,
          speed: 0.012 + Math.random() * 0.01,
          gold: Math.random() < 0.3,
        });
      }

      const next: Pulse[] = [];
      for (const pulse of pulses) {
        if (pulse.from >= drawX.length || pulse.to >= drawX.length) {
          continue;
        }
        const ax = drawX[pulse.from];
        const ay = drawY[pulse.from];
        const dx = drawX[pulse.to] - ax;
        const dy = drawY[pulse.to] - ay;
        // El enlace se rompió (los nodos se alejaron): el pulso se apaga.
        if (dx * dx + dy * dy > reachSq * 1.2) {
          continue;
        }

        pulse.t += pulse.speed * dt;
        if (pulse.t >= 1) {
          // Sigue por otro enlace del nodo de llegada, como un dato que fluye por la red.
          const options: number[] = [];
          for (let k = 0; k < links.length; k += 2) {
            if (links[k] === pulse.to && links[k + 1] !== pulse.from) {
              options.push(links[k + 1]);
            } else if (links[k + 1] === pulse.to && links[k] !== pulse.from) {
              options.push(links[k]);
            }
          }
          if (options.length && Math.random() < 0.7) {
            const to = options[Math.floor(Math.random() * options.length)];
            next.push({ ...pulse, from: pulse.to, to, t: 0 });
          }
          continue;
        }

        const x = ax + dx * pulse.t;
        const y = ay + dy * pulse.t;
        const color = pulse.gold ? gold : teal;
        // Aparece y se desvanece en los extremos del tramo.
        const fade = Math.sin(pulse.t * Math.PI);
        context.fillStyle = `rgba(${color}, ${0.16 * fade})`;
        context.beginPath();
        context.arc(x, y, 7, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = `rgba(${color}, ${0.95 * fade})`;
        context.beginPath();
        context.arc(x, y, 1.9, 0, Math.PI * 2);
        context.fill();
        next.push(pulse);
      }
      pulses = next;
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

    const updateFromClient = (clientX: number, clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
    };

    const onMouseMove = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse') {
        return;
      }
      updateFromClient(event.clientX, event.clientY);
      pointer.active = true;
      pointer.mouse = true;
    };

    const onMouseLeave = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse') {
        return;
      }
      pointer.active = false;
    };

    const rememberFinger = (clientX: number, clientY: number): void => {
      lastClientX = clientX;
      lastClientY = clientY;
      pointer.active = true;
      pointer.mouse = false;
      updateFromClient(clientX, clientY);
      if (reduce) {
        draw(0);
      }
    };

    const onTouchDown = (event: PointerEvent): void => {
      if (event.pointerType === 'mouse') {
        return;
      }
      touchPointerId = event.pointerId;
      rememberFinger(event.clientX, event.clientY);
    };

    const onTouchMove = (event: PointerEvent): void => {
      if (touchPointerId === null || event.pointerId !== touchPointerId) {
        return;
      }
      rememberFinger(event.clientX, event.clientY);
    };

    // After a scroll starts, Chrome stops pointermove but keeps sending the real
    // finger position on pointerrawupdate and touchmove.
    const onPointerRaw = (event: Event): void => {
      if (!(event instanceof PointerEvent)) {
        return;
      }
      if (event.pointerType === 'mouse' || event.pointerId !== touchPointerId) {
        return;
      }
      rememberFinger(event.clientX, event.clientY);
    };

    const onTouchMoveTrack = (event: TouchEvent): void => {
      if (touchPointerId === null || event.touches.length === 0) {
        return;
      }
      let touch: Touch | undefined;
      for (let i = 0; i < event.touches.length; i++) {
        if (event.touches[i].identifier === touchPointerId) {
          touch = event.touches[i];
          break;
        }
      }
      if (!touch) {
        touch = event.touches[0];
      }
      rememberFinger(touch.clientX, touch.clientY);
    };

    const onTouchEnd = (event: PointerEvent): void => {
      if (event.pointerId !== touchPointerId) {
        return;
      }
      // The browser cancels the pointer when a touch becomes a scroll, while the
      // finger is still on the screen. That touchend does not bubble, so the
      // listener below only sees the real lift.
      if (event.type === 'pointercancel') {
        return;
      }
      touchPointerId = null;
      pointer.active = false;
    };

    const onTouchListEnd = (event: TouchEvent): void => {
      if (event.touches.length === 0) {
        touchPointerId = null;
        pointer.active = false;
      }
    };

    const onScroll = (): void => {
      if (touchPointerId === null) {
        return;
      }
      updateFromClient(lastClientX, lastClientY);
      if (reduce) {
        draw(0);
      }
    };

    const onVisibility = (): void => {
      if (document.hidden) {
        stopLoop();
        return;
      }
      if (visible) {
        startLoop();
      }
    };

    readColors();
    resize();
    draw(0);

    // Al cambiar de tema se releen los colores (y se redibuja si no hay animación).
    const themeObserver = new MutationObserver(() => {
      readColors();
      if (reduce) {
        draw(0);
      }
    });
    themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });

    host.addEventListener('pointermove', onMouseMove);
    host.addEventListener('pointerleave', onMouseLeave);
    window.addEventListener('pointerdown', onTouchDown);
    window.addEventListener('pointermove', onTouchMove);
    window.addEventListener('pointerrawupdate', onPointerRaw);
    window.addEventListener('pointerup', onTouchEnd);
    window.addEventListener('pointercancel', onTouchEnd);
    window.addEventListener('touchmove', onTouchMoveTrack, { passive: true });
    window.addEventListener('touchend', onTouchListEnd);
    window.addEventListener('scroll', onScroll, { passive: true });
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
      themeObserver.disconnect();
      observer?.disconnect();
      intersection?.disconnect();
      host.removeEventListener('pointermove', onMouseMove);
      host.removeEventListener('pointerleave', onMouseLeave);
      window.removeEventListener('pointerdown', onTouchDown);
      window.removeEventListener('pointermove', onTouchMove);
      window.removeEventListener('pointerrawupdate', onPointerRaw);
      window.removeEventListener('pointerup', onTouchEnd);
      window.removeEventListener('pointercancel', onTouchEnd);
      window.removeEventListener('touchmove', onTouchMoveTrack);
      window.removeEventListener('touchend', onTouchListEnd);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }
}

function nodeCount(width: number, height: number): number {
  return Math.max(28, Math.min(90, Math.round((width * height) / 17000)));
}

function createNode(width: number, height: number): PlexusNode {
  const angle = Math.random() * Math.PI * 2;
  const z = 0.35 + Math.random() * 0.65;
  const speed = (0.12 + Math.random() * 0.3) * (0.5 + z * 0.6);
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: Math.random() > 0.82 ? 2.2 : 1.4,
    gold: Math.random() > 0.84,
    z,
  };
}
