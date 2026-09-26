import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type ProgressTone = 'accent' | 'warn' | 'danger' | 'success';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-progress-bar',
  template: `
    <div class="progress-block" role="progressbar" [attr.aria-valuenow]="value"
      [attr.aria-valuemin]="0" [attr.aria-valuemax]="max" [attr.aria-label]="ariaLabel">
      <div class="progress-head" *ngIf="label || showValue">
        <span class="progress-label" *ngIf="label">{{ label }}</span>
        <strong class="progress-value" *ngIf="showValue">{{ value }}%</strong>
      </div>
      <div class="progress-track">
        <span class="progress-fill" [class.fill-warn]="tone === 'warn'"
          [class.fill-danger]="tone === 'danger'" [class.fill-success]="tone === 'success'"
          [style.width]="widthPct"></span>
      </div>
    </div>
  `,
  styles: [
    `
      .progress-block {
        width: 100%;
      }
      .progress-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
      }
      .progress-label {
        font-size: 13px;
        color: var(--text-secondary);
      }
      .progress-value {
        font-size: 14px;
        color: var(--text-primary);
      }
      .progress-track {
        height: 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .progress-fill {
        display: block;
        height: 100%;
        border-radius: 999px;
        background: var(--grad-accent);
        transition: width 1.1s cubic-bezier(0.22, 1, 0.36, 1);
        animation: progressFill 1.1s cubic-bezier(0.22, 1, 0.36, 1) backwards;
      }
      .progress-fill.fill-warn {
        background: linear-gradient(90deg, #f59e0b, #fbbf24);
      }
      .progress-fill.fill-danger {
        background: linear-gradient(90deg, #ef4444, #f87171);
      }
      .progress-fill.fill-success {
        background: linear-gradient(90deg, #10b981, #34d399);
      }
      @keyframes progressFill {
        from {
          width: 0;
        }
      }
    `,
  ],
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() label = '';
  @Input() showValue = true;
  @Input() ariaLabel = '';
  @Input() tone: ProgressTone = 'accent';

  get widthPct(): string {
    const raw = (this.value / this.max) * 100;
    const pct = Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;
    return pct + '%';
  }
}