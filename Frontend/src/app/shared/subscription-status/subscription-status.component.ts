import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { PremiumBadgeComponent } from '../premium-badge/premium-badge.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent, PremiumBadgeComponent],
  selector: 'app-subscription-status',
  template: `
    <div class="sub-status" [class.collapsed]="collapsed">
      <ng-container *ngIf="subscription.state$ | async as state">
        <!-- Loading skeleton -->
        <div class="sub-skeleton" *ngIf="state.loading">
          <span class="skeleton sk-line"></span>
          <span class="skeleton sk-line short"></span>
          <span class="skeleton sk-btn"></span>
        </div>

        <ng-container *ngIf="!state.loading">
          <!-- Collapsed: compact indicator -->
          <a
            *ngIf="collapsed"
            class="sub-compact"
            routerLink="/dashboard/usage"
            [title]="state.planLabel"
            [attr.aria-label]="state.planLabel"
          >
            <app-icon [name]="state.premium ? 'star' : 'zap'" [size]="18" />
          </a>

          <!-- Expanded -->
          <div class="sub-full" *ngIf="!collapsed">
            <div class="sub-plan-row">
              <span class="sub-plan">{{ state.planLabel }}</span>
              <app-premium-badge *ngIf="state.premium" [compact]="true" />
            </div>

            <div class="sub-usage">
              <span class="sub-usage-row">{{ resumeSlotsLabel }}</span>
              <span class="sub-usage-row">{{ analysesLeftLabel }}</span>
            </div>

            <a
              *ngIf="!state.premium"
              routerLink="/dashboard/upgrade"
              class="btn btn-primary btn-sm sub-cta"
            >
              <app-icon name="star" [size]="14" />
              Upgrade to Premium
            </a>
            <a
              *ngIf="state.premium"
              routerLink="/dashboard/usage"
              class="btn btn-secondary btn-sm sub-cta"
            >
              Manage Plan
            </a>
          </div>
        </ng-container>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .sub-status {
        margin-top: 12px;
        padding: 14px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-subtle);
        background: rgba(255, 255, 255, 0.02);
      }
      .sub-status.collapsed {
        padding: 8px;
        display: grid;
        place-items: center;
      }
      .sub-plan-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }
      .sub-plan {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-primary);
      }
      .sub-usage {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 12px;
      }
      .sub-usage-row {
        font-size: 12.5px;
        color: var(--text-secondary);
        line-height: 1.4;
      }
      .sub-cta {
        width: 100%;
      }
      .sub-compact {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        color: #a5b4fc;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.16),
          rgba(139, 92, 246, 0.12)
        );
        border: 1px solid rgba(129, 140, 248, 0.3);
        text-decoration: none;
      }
      .sub-skeleton {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .sk-line {
        height: 12px;
        width: 100%;
      }
      .sk-line.short {
        width: 65%;
      }
      .sk-btn {
        height: 32px;
        width: 100%;
        margin-top: 4px;
        border-radius: 10px;
      }
    `,
  ],
})
export class SubscriptionStatusComponent {
  @Input() collapsed = false;

  constructor(public subscription: SubscriptionService) {}

  get resumeSlotsLabel(): string {
    const e = this.subscription.usageOf('resumeSlots');
    return `${e.used} / ${e.limit} resume slots`;
  }

  get analysesLeftLabel(): string {
    return this.subscription.remainingLabel('resumeAnalyses');
  }
}