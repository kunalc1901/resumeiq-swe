import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

/**
 * Professional, theme-matched page/block loader for ResumeIQ.
 *
 * Motion is driven by requestAnimationFrame (not CSS keyframes) so it keeps
 * animating even when the OS "reduce motion" setting is enabled.
 *
 * Usage:
 *   - Auto mode: <app-loader [auto]="true" [duration]="5000" (complete)="..."/>
 *     runs its own 0-100% progress and emits `complete` when done.
 *   - Manual mode: drive [visible] directly (e.g. until a real API responds):
 *     <app-loader [visible]="loading" />
 */
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-loader',
  template: `
    <div class="loader-overlay" *ngIf="visible" [class.hidden]="fading">
      <div class="loader-inner">
        <div class="loader-visual">
          <span class="ring ring-outer" aria-hidden="true"></span>
          <span class="ring ring-inner" aria-hidden="true"></span>
          <span class="brand-mark" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="loaderBrandGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0" stop-color="#6366f1" />
                  <stop offset="1" stop-color="#8b5cf6" />
                </linearGradient>
              </defs>
              <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#loaderBrandGrad)" />
              <path d="M10 9h8.5a1 1 0 0 1 1 1v4.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
              <path d="M10 14h6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
              <path d="M10 18h7" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
              <path
                d="M23.5 19.5 24.9 22l2.6 1.4-2.6 1.4-1.4 2.6-1.4-2.6-2.6-1.4 2.6-1.4z"
                fill="#fff"
              />
            </svg>
          </span>
          <span class="orbit-dot" aria-hidden="true"></span>
        </div>

        <div class="loader-title">ResumeIQ</div>
        <div class="loader-text">
          {{ text }}<span class="dots"><span>.</span><span>.</span><span>.</span></span>
        </div>

        <div class="loader-track">
          <span class="loader-fill" [style.width.%]="progress"></span>
        </div>
        <div class="loader-pct" *ngIf="auto && progress < 100">{{ progress }}%</div>
      </div>
    </div>
  `,
  styles: [
    `
      .loader-overlay {
        position: fixed;
        inset: 0;
        z-index: 300;
        display: grid;
        place-items: center;
        background:
          radial-gradient(640px 420px at 50% -10%, rgba(99, 102, 241, 0.16), transparent 62%),
          radial-gradient(520px 380px at 88% 108%, rgba(139, 92, 246, 0.12), transparent 60%),
          var(--bg-base);
        opacity: 1;
        visibility: visible;
        transition: opacity 0.4s ease, visibility 0.4s ease;
      }
      .loader-overlay.hidden {
        opacity: 0;
        visibility: hidden;
      }

      .loader-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        max-width: 340px;
        padding: 24px;
      }

      /* Visual */
      .loader-visual {
        position: relative;
        width: 108px;
        height: 108px;
        margin-bottom: 28px;
      }
      .ring {
        position: absolute;
        border-radius: 50%;
        will-change: transform;
      }
      .ring-outer {
        inset: 0;
        border: 2px solid rgba(129, 140, 248, 0.18);
        border-top-color: var(--accent-indigo);
        border-right-color: rgba(139, 92, 246, 0.55);
      }
      .ring-inner {
        inset: 12px;
        border: 1.5px dashed rgba(139, 92, 246, 0.32);
      }
      .brand-mark {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        box-shadow: 0 0 34px -8px var(--glow-accent),
          inset 0 1px 0 rgba(255, 255, 255, 0.18);
        will-change: transform, opacity;
      }
      .orbit-dot {
        position: absolute;
        top: -4px;
        left: 50%;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--accent-cyan);
        box-shadow: 0 0 12px var(--accent-cyan);
        will-change: transform;
      }

      /* Text */
      .loader-title {
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: var(--text-primary);
        margin-bottom: 8px;
      }
      .loader-text {
        font-size: 13.5px;
        color: var(--text-secondary);
        min-height: 20px;
      }

      /* Progress */
      .loader-track {
        width: 220px;
        height: 6px;
        margin-top: 26px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.07);
        overflow: hidden;
      }
      .loader-fill {
        display: block;
        height: 100%;
        border-radius: 999px;
        background: var(--grad-accent);
        transition: width 0.12s linear;
      }
      .loader-pct {
        margin-top: 10px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--text-muted);
      }
    `,
  ],
})
export class LoaderComponent implements OnInit, OnDestroy {
  /** Show/hide the overlay (manual mode). */
  @Input() visible = true;
  /** Status text shown under the brand. */
  @Input() text = 'Preparing your workspace';
  /** Auto-run the 0-100% progress bar and emit `complete`. */
  @Input() auto = false;
  /** Duration in ms for auto mode. */
  @Input() duration = 5000;
  /** Emitted once the auto loader finishes. */
  @Output() complete = new EventEmitter<void>();

  progress = 0;
  fading = false;
  done = false;

  private raf = 0;
  private start = 0;
  private outer: HTMLElement | null = null;
  private inner: HTMLElement | null = null;
  private brand: HTMLElement | null = null;
  private orbit: HTMLElement | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.start = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }

  private tick = (now: number): void => {
    if (this.done) {
      return;
    }
    if (!this.visible || this.fading) {
      this.raf = requestAnimationFrame(this.tick);
      return;
    }

    const t = now - this.start;

    // Auto progress -> drives the bar and completes the loader.
    if (this.auto) {
      const pct = Math.min(100, (t / this.duration) * 100);
      this.progress = Math.round(pct);
      if (pct >= 100) {
        this.fadeOut();
        return;
      }
    }

    this.cacheEls();
    const degOuter = (t / 1600) * 360;
    const degInner = -(t / 2600) * 360;
    const pulse = Math.sin((t / 550) * Math.PI);
    if (this.outer) {
      this.outer.style.transform = `rotate(${degOuter}deg)`;
    }
    if (this.inner) {
      this.inner.style.transform = `rotate(${degInner}deg)`;
    }
    if (this.brand) {
      this.brand.style.transform = `scale(${1 + 0.05 * pulse})`;
      this.brand.style.opacity = `${0.9 + 0.1 * pulse}`;
    }
    if (this.orbit) {
      const a = (t / 2600) * 360;
      this.orbit.style.transform = `translateX(-50%) rotate(${a}deg) translateX(54px) rotate(${-a}deg)`;
    }

    this.raf = requestAnimationFrame(this.tick);
  };

  private cacheEls(): void {
    if (this.outer) {
      return;
    }
    const host = this.el.nativeElement;
    this.outer = host.querySelector<HTMLElement>('.ring-outer');
    this.inner = host.querySelector<HTMLElement>('.ring-inner');
    this.brand = host.querySelector<HTMLElement>('.brand-mark');
    this.orbit = host.querySelector<HTMLElement>('.orbit-dot');
  }

  private fadeOut(): void {
    this.done = true;
    this.progress = 100;
    this.fading = true;
    setTimeout(() => {
      this.visible = false;
      this.complete.emit();
    }, 420);
  }
}