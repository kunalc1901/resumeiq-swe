import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  selector: 'app-premium-badge',
  template: `
    <span class="premium-badge" [class.compact]="compact">
      <app-icon name="star" [size]="compact ? 11 : 12" />
      {{ label }}
    </span>
  `,
  styles: [
    `
      .premium-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 11px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.02em;
        color: #e0e7ff;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.2),
          rgba(139, 92, 246, 0.16)
        );
        border: 1px solid rgba(129, 140, 248, 0.4);
        box-shadow: 0 0 14px -4px var(--glow-accent);
        white-space: nowrap;
      }
      .premium-badge.compact {
        padding: 2px 8px;
        font-size: 11px;
      }
    `,
  ],
})
export class PremiumBadgeComponent {
  @Input() label = 'Premium';
  @Input() compact = false;
}