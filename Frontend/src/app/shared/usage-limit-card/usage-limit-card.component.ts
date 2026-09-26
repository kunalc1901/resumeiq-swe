import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  selector: 'app-usage-limit-card',
  template: `
    <div class="limit-card dash-card dash-card-pad">
      <div class="limit-icon" aria-hidden="true">
        <app-icon [name]="icon" [size]="22" />
      </div>
      <div class="limit-body">
        <h3 class="limit-title">{{ title }}</h3>
        <p class="limit-message">{{ message }}</p>
        <p class="limit-reset" *ngIf="resetLabel">{{ resetLabel }}</p>
      </div>
      <div class="limit-actions">
        <button type="button" class="btn btn-primary" (click)="upgrade.emit()">
          <app-icon name="star" [size]="15" />
          {{ primaryLabel }}
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          *ngIf="showSecondary"
          (click)="secondary.emit()"
        >
          {{ secondaryLabel }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .limit-card {
        display: flex;
        align-items: flex-start;
        gap: 18px;
        border-color: rgba(248, 113, 113, 0.28);
        background: linear-gradient(
          135deg,
          rgba(248, 113, 113, 0.06),
          rgba(15, 19, 34, 0.4)
        );
      }
      .limit-icon {
        width: 46px;
        height: 46px;
        border-radius: 13px;
        display: grid;
        place-items: center;
        flex: none;
        color: #fca5a5;
        background: rgba(248, 113, 113, 0.12);
        border: 1px solid rgba(248, 113, 113, 0.3);
      }
      .limit-body {
        flex: 1;
        min-width: 0;
      }
      .limit-title {
        font-size: 15.5px;
        font-weight: 700;
        margin: 0 0 6px;
        color: var(--text-primary);
      }
      .limit-message {
        font-size: 13.5px;
        line-height: 1.6;
        color: var(--text-secondary);
        margin: 0;
      }
      .limit-reset {
        font-size: 12.5px;
        color: var(--text-muted);
        margin: 8px 0 0;
      }
      .limit-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: none;
      }
      @media (max-width: 640px) {
        .limit-card {
          flex-direction: column;
        }
        .limit-actions {
          width: 100%;
          flex-direction: row;
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class UsageLimitCardComponent {
  @Input() icon = 'alert-circle';
  @Input() title = 'Limit reached';
  @Input() message = '';
  @Input() resetLabel = '';
  @Input() primaryLabel = 'Upgrade to Premium';
  @Input() secondaryLabel = 'View Usage';
  @Input() showSecondary = true;

  @Output() upgrade = new EventEmitter<void>();
  @Output() secondary = new EventEmitter<void>();
}