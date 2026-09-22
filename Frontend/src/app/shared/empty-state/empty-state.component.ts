import { Component, Input } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  standalone: true,
  imports: [AppIconComponent],
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <div class="empty-icon" aria-hidden="true">
        <app-icon [name]="icon" [size]="26" />
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-text">{{ text }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 48px 24px;
        border: 1px dashed var(--border-strong);
        border-radius: var(--radius-lg);
        background: rgba(255, 255, 255, 0.015);
      }
      .empty-icon {
        width: 60px;
        height: 60px;
        border-radius: 18px;
        display: grid;
        place-items: center;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.16),
          rgba(139, 92, 246, 0.12)
        );
        border: 1px solid rgba(129, 140, 248, 0.28);
        color: #a5b4fc;
        margin-bottom: 18px;
      }
      .empty-title {
        font-size: 17px;
        font-weight: 700;
        margin: 0 0 8px;
        color: var(--text-primary);
      }
      .empty-text {
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-secondary);
        margin: 0 0 20px;
        max-width: 360px;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() icon = 'file-text';
  @Input() title = '';
  @Input() text = '';
}