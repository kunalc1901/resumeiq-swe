import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { Stat } from '../../core/models/dashboard.model';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent, ProgressBarComponent],
  selector: 'app-stat-card',
  template: `
    <div class="stat-card dash-card dash-card-pad">
      <div class="stat-top">
        <div class="icon-tile icon-tile-sm" [class.tone]="stat.tone" [attr.aria-hidden]="true">
          <app-icon [name]="stat.icon" [size]="18" />
        </div>
        <app-progress-bar *ngIf="stat.progress !== undefined" [value]="stat.progress" [showValue]="false"
          aria-label="{{ stat.label }}" />
      </div>
      <div class="stat-value">{{ stat.value }}</div>
      <div class="stat-label">{{ stat.label }}</div>
      <div class="stat-sub">{{ stat.sub }}</div>
    </div>
  `,
  styles: [
    `
      .stat-card {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .stat-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 14px;
        min-height: 36px;
      }
      .icon-tile.tone-accent {
        color: #a5b4fc;
      }
      .icon-tile.tone-success {
        color: #6ee7b7;
        background: rgba(52, 211, 153, 0.1);
        border-color: rgba(52, 211, 153, 0.28);
      }
      .icon-tile.tone-warn {
        color: #fcd34d;
        background: rgba(251, 191, 36, 0.1);
        border-color: rgba(251, 191, 36, 0.28);
      }
      .icon-tile.tone-info {
        color: #7dd3fc;
        background: rgba(56, 189, 248, 0.1);
        border-color: rgba(56, 189, 248, 0.28);
      }
      .stat-value {
        font-size: 28px;
        font-weight: 800;
        color: var(--text-primary);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .stat-label {
        font-size: 13.5px;
        color: var(--text-secondary);
        margin-top: 2px;
      }
      .stat-sub {
        font-size: 12px;
        color: var(--text-muted);
      }
    `,
  ],
})
export class StatCardComponent {
  @Input() stat!: Stat;
}