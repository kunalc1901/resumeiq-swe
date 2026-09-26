import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { computeUsageTone } from '../../core/services/subscription.service';
import { UsageEntry } from '../../core/models/subscription.model';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  standalone: true,
  imports: [CommonModule, ProgressBarComponent],
  selector: 'app-usage-progress',
  template: `
    <div class="usage-progress">
      <div class="usage-head">
        <span class="usage-label">{{ label }}</span>
        <span class="usage-count">{{ usage.used }} of {{ usage.limit }} used</span>
      </div>
      <app-progress-bar [value]="percent" [max]="100" [showValue]="false" [tone]="tone" />
      <div class="usage-foot">
        <span class="usage-remaining" *ngIf="remaining > 0">
          {{ remaining }} {{ remaining === 1 ? unitSingular : unit }} remaining
        </span>
        <span class="usage-reached" *ngIf="remaining === 0">Limit reached</span>
      </div>
    </div>
  `,
  styles: [
    `
      .usage-progress {
        width: 100%;
      }
      .usage-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
      }
      .usage-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
      }
      .usage-count {
        font-size: 13px;
        color: var(--text-secondary);
      }
      .usage-foot {
        margin-top: 8px;
        font-size: 12.5px;
      }
      .usage-remaining {
        color: var(--text-muted);
      }
      .usage-reached {
        color: #f87171;
        font-weight: 600;
      }
    `,
  ],
})
export class UsageProgressComponent {
  @Input() usage: UsageEntry = { used: 0, limit: 0 };
  @Input() label = '';
  @Input() unit = '';
  @Input() unitSingular = '';

  get percent(): number {
    if (!this.usage.limit) {
      return 100;
    }
    return Math.min(100, Math.round((this.usage.used / this.usage.limit) * 100));
  }

  get remaining(): number {
    return Math.max(0, this.usage.limit - this.usage.used);
  }

  get tone(): 'accent' | 'warn' | 'danger' | 'success' {
    switch (computeUsageTone(this.usage.used, this.usage.limit)) {
      case 'exhausted':
        return 'danger';
      case 'almost':
      case 'close':
        return 'warn';
      default:
        return 'accent';
    }
  }
}