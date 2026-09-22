import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-score-ring',
  template: `
    <div
      class="score-ring"
      [style.--ring-size]="size + 'px'"
      [style.--ring-circ]="circumference + 'px'"
    >
      <svg viewBox="0 0 120 120">
        <defs>
          <linearGradient [attr.id]="gradId" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#6366f1" />
            <stop offset="1" stop-color="#38bdf8" />
          </linearGradient>
        </defs>
        <circle class="ring-bg" cx="60" cy="60" r="52" />
        <circle
          class="ring-fg"
          cx="60"
          cy="60"
          r="52"
          [attr.stroke]="'url(#' + gradId + ')'"
          [attr.stroke-dashoffset]="dashOffset"
        />
      </svg>
      <div class="score-ring-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .score-ring {
        position: relative;
        width: var(--ring-size, 120px);
        height: var(--ring-size, 120px);
        flex: none;
      }
      .score-ring svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
      .ring-bg {
        fill: none;
        stroke: rgba(255, 255, 255, 0.08);
        stroke-width: 9;
      }
      .ring-fg {
        fill: none;
        stroke-width: 9;
        stroke-linecap: round;
        stroke-dasharray: var(--ring-circ);
        transition: stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .score-ring-content {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        text-align: center;
      }
    `,
  ],
})
export class ScoreRingComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() size = 120;

  private static uid = 0;
  readonly gradId = `scoreRingGrad${++ScoreRingComponent.uid}`;

  readonly circumference = 2 * Math.PI * 52;

  private ready = false;

  ngOnInit(): void {
    setTimeout(() => (this.ready = true), 50);
  }

  get dashOffset(): number {
    const pct = Math.max(0, Math.min(100, (this.value / this.max) * 100));
    return this.ready ? this.circumference * (1 - pct / 100) : this.circumference;
  }
}