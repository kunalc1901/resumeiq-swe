import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  selector: 'app-upgrade-modal',
  template: `
    <div class="modal-backdrop" *ngIf="open" (click)="onDismiss()">
      <div
        class="modal-card"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title"
        (click)="$event.stopPropagation()"
      >
        <div class="modal-icon" aria-hidden="true">
          <app-icon [name]="icon" [size]="24" />
        </div>
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
        <p class="modal-note" *ngIf="note">{{ note }}</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" (click)="onDismiss()">
            {{ secondaryLabel }}
          </button>
          <button type="button" class="btn btn-primary" (click)="onUpgrade()">
            <app-icon name="star" [size]="15" />
            {{ primaryLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 200;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(2, 3, 8, 0.66);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        animation: modalFade 0.2s ease both;
      }
      .modal-card {
        width: 100%;
        max-width: 430px;
        padding: 28px;
        text-align: center;
        background: var(--bg-card);
        border: 1px solid var(--border-strong);
        border-radius: var(--radius-lg);
        box-shadow: 0 32px 64px -24px rgba(0, 0, 0, 0.7),
          0 0 40px -18px var(--glow-accent);
        animation: modalIn 0.24s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .modal-icon {
        width: 52px;
        height: 52px;
        margin: 0 auto 16px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        color: #a5b4fc;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.18),
          rgba(139, 92, 246, 0.14)
        );
        border: 1px solid rgba(129, 140, 248, 0.3);
      }
      .modal-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 10px;
        color: var(--text-primary);
      }
      .modal-message {
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-secondary);
        margin: 0;
      }
      .modal-note {
        margin: 14px auto 0;
        font-size: 12.5px;
        color: var(--text-muted);
        max-width: 300px;
        line-height: 1.5;
      }
      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 24px;
        flex-wrap: wrap;
      }
      @keyframes modalFade {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes modalIn {
        from {
          opacity: 0;
          transform: translateY(14px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
    `,
  ],
})
export class UpgradeModalComponent {
  @Input() open = false;
  @Input() title = 'Upgrade to Premium';
  @Input() message = '';
  @Input() note = '';
  @Input() icon = 'sparkles';
  @Input() primaryLabel = 'Upgrade to Premium';
  @Input() secondaryLabel = 'Maybe Later';

  @Output() upgrade = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  onUpgrade(): void {
    this.upgrade.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.onDismiss();
    }
  }
}