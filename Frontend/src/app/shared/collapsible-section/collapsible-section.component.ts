import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  selector: 'app-collapsible-section',
  template: `
    <section class="collapsible" [class.is-open]="open">
      <button
        type="button"
        class="collapsible-header"
        (click)="open = !open"
        [attr.aria-expanded]="open"
      >
        <span class="collapsible-icon" *ngIf="icon" aria-hidden="true">
          <app-icon [name]="icon" [size]="18" />
        </span>
        <span class="collapsible-title">{{ title }}</span>
        <span class="collapsible-chevron" aria-hidden="true">
          <app-icon name="chevron-down" [size]="18" />
        </span>
      </button>
      <div class="collapsible-body" [class.is-open]="open">
        <div class="collapsible-inner">
          <ng-content></ng-content>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .collapsible {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        overflow: hidden;
      }
      .collapsible-header {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 18px 22px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--text-primary);
        font-family: var(--font-sans);
        text-align: left;
        transition: background-color 0.18s ease;
      }
      .collapsible-header:hover {
        background: rgba(255, 255, 255, 0.03);
      }
      .collapsible-icon {
        color: #a5b4fc;
        display: inline-flex;
      }
      .collapsible-title {
        flex: 1;
        font-size: 15.5px;
        font-weight: 700;
      }
      .collapsible-chevron {
        color: var(--text-muted);
        display: inline-flex;
        transition: transform 0.3s ease;
      }
      .collapsible.is-open .collapsible-chevron {
        transform: rotate(180deg);
      }
      .collapsible-body {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.35s ease;
      }
      .collapsible-body.is-open {
        grid-template-rows: 1fr;
      }
      .collapsible-inner {
        overflow: hidden;
        min-height: 0;
        padding: 0 22px;
      }
      .collapsible-body.is-open .collapsible-inner {
        padding-bottom: 22px;
      }
    `,
  ],
})
export class CollapsibleSectionComponent {
  @Input() title = '';
  @Input() icon = '';
  @Input() open = true;
}