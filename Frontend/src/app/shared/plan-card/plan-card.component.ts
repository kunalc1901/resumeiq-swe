import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { PremiumBadgeComponent } from '../premium-badge/premium-badge.component';
import { PlanConfig } from '../../core/constants/plan.config';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent, PremiumBadgeComponent],
  selector: 'app-plan-card',
  template: `
    <div class="plan-card dash-card" [class.highlight]="highlight" [class.current]="current">
      <div class="plan-head">
        <div class="plan-name-row">
          <h3 class="plan-name">{{ plan.planLabel }}</h3>
          <app-premium-badge *ngIf="plan.id === 'premium'" [compact]="true" />
          <span class="tag" *ngIf="current">Current plan</span>
        </div>
        <div class="plan-price">
          <span class="price-value">{{ plan.priceLabel }}</span>
          <span class="price-unit" *ngIf="plan.price !== null && plan.price > 0">/ month</span>
        </div>
        <p class="plan-tagline">{{ plan.tagline }}</p>
      </div>

      <ul class="plan-features">
        <li *ngFor="let feature of features">
          <span class="feature-check" aria-hidden="true">
            <app-icon name="check" [size]="14" />
          </span>
          {{ feature }}
        </li>
      </ul>

      <button
        type="button"
        class="btn plan-cta"
        [class.btn-primary]="highlight"
        [class.btn-secondary]="!highlight"
        [disabled]="disabled"
        (click)="cta.emit()"
      >
        {{ ctaLabel }}
      </button>
    </div>
  `,
  styles: [
    `
      .plan-card {
        display: flex;
        flex-direction: column;
        padding: 26px;
        height: 100%;
        transition: transform 0.22s ease, border-color 0.22s ease,
          box-shadow 0.22s ease;
      }
      .plan-card.highlight {
        border-color: rgba(129, 140, 248, 0.45);
        background: linear-gradient(
          160deg,
          rgba(99, 102, 241, 0.08),
          var(--bg-card) 55%
        );
        box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.6),
          0 0 36px -20px var(--glow-accent);
      }
      .plan-card.current {
        border-color: rgba(129, 140, 248, 0.3);
      }
      .plan-head {
        margin-bottom: 20px;
      }
      .plan-name-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .plan-name {
        font-size: 17px;
        font-weight: 800;
        margin: 0;
        color: var(--text-primary);
      }
      .plan-price {
        display: flex;
        align-items: baseline;
        gap: 6px;
        margin-top: 14px;
      }
      .price-value {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--text-primary);
      }
      .price-unit {
        font-size: 13px;
        color: var(--text-muted);
      }
      .plan-tagline {
        font-size: 13.5px;
        line-height: 1.6;
        color: var(--text-secondary);
        margin: 12px 0 0;
      }
      .plan-features {
        list-style: none;
        margin: 0 0 24px;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
      }
      .plan-features li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 13.5px;
        line-height: 1.5;
        color: var(--text-secondary);
      }
      .feature-check {
        display: inline-grid;
        place-items: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        flex: none;
        color: #a5b4fc;
        background: rgba(99, 102, 241, 0.14);
        border: 1px solid rgba(129, 140, 248, 0.28);
        margin-top: 1px;
      }
      .plan-cta {
        width: 100%;
      }
    `,
  ],
})
export class PlanCardComponent {
  @Input() plan!: PlanConfig;
  @Input() features: string[] = [];
  @Input() highlight = false;
  @Input() current = false;
  @Input() disabled = false;
  @Input() ctaLabel = 'Choose plan';

  @Output() cta = new EventEmitter<void>();
}