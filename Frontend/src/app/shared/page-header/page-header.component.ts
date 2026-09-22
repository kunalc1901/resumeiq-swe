import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-page-header',
  template: `
    <div class="page-head">
      <div>
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-sub" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="page-actions" *ngIf="showActions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .page-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 32px;
        flex-wrap: wrap;
      }
      .page-title {
        font-size: clamp(1.6rem, 2.6vw, 2.1rem);
        letter-spacing: -0.02em;
        font-weight: 800;
        margin: 0;
        color: var(--text-primary);
        line-height: 1.15;
      }
      .page-sub {
        margin: 8px 0 0;
        font-size: 1rem;
        color: var(--text-secondary);
        line-height: 1.55;
        max-width: 560px;
      }
      .page-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showActions = true;
}