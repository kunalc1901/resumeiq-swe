import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

export interface PasswordRule {
  id: string;
  label: string;
  met: boolean;
}

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  selector: 'app-password-policy',
  template: `
    <div class="policy" *ngIf="visible">
      <div class="strength-row" [class]="'level-' + strengthLevel">
        <span class="strength-label">{{ strengthLabel }}</span>
        <div class="strength-segs" aria-hidden="true">
          <span class="seg" *ngFor="let i of segments" [class.lit]="i < litSegments"></span>
        </div>
      </div>

      <ul class="policy-list">
        <li *ngFor="let rule of rules" [class.met]="rule.met">
          <span class="rule-icon" aria-hidden="true">
            <app-icon *ngIf="rule.met" name="check" [size]="13" />
            <span class="rule-dot" *ngIf="!rule.met"></span>
          </span>
          <span class="rule-label">{{ rule.label }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .policy {
        margin-top: 10px;
        padding: 12px 14px;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        background: rgba(255, 255, 255, 0.02);
        animation: policyIn 0.22s ease both;
      }
      @keyframes policyIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      .strength-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
      }
      .strength-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: var(--text-muted);
        transition: color 0.2s ease;
      }
      .strength-label:empty {
        display: none;
      }
      .strength-row.level-weak .strength-label {
        color: #f87171;
      }
      .strength-row.level-fair .strength-label {
        color: #fbbf24;
      }
      .strength-row.level-good .strength-label {
        color: #a5b4fc;
      }
      .strength-row.level-strong .strength-label {
        color: #34d399;
      }
      .strength-segs {
        display: flex;
        gap: 5px;
        flex: 1;
        max-width: 120px;
      }
      .seg {
        height: 5px;
        flex: 1;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.09);
        transition: background-color 0.2s ease;
      }
      .seg.lit {
        background: var(--text-muted);
      }
      .strength-row.level-weak .seg.lit {
        background: #f87171;
      }
      .strength-row.level-fair .seg.lit {
        background: #fbbf24;
      }
      .strength-row.level-good .seg.lit {
        background: #818cf8;
      }
      .strength-row.level-strong .seg.lit {
        background: #34d399;
      }
      .policy-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 7px;
      }
      .policy-list li {
        display: flex;
        align-items: center;
        gap: 9px;
        font-size: 12.5px;
        color: var(--text-muted);
        transition: color 0.2s ease;
      }
      .policy-list li.met {
        color: var(--text-secondary);
      }
      .rule-icon {
        display: inline-grid;
        place-items: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        flex: none;
        color: var(--text-muted);
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-subtle);
        transition: background-color 0.2s ease, border-color 0.2s ease,
          color 0.2s ease;
      }
      .policy-list li.met .rule-icon {
        color: #34d399;
        background: rgba(52, 211, 153, 0.1);
        border-color: rgba(52, 211, 153, 0.28);
      }
      .rule-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }
    `,
  ],
})
export class PasswordPolicyComponent implements OnInit, OnChanges {
  /** The current password value (lower-case is fine; met rules are live). */
  @Input() value = '';
  /** Show the panel while the field is focused, even before typing. */
  @Input() focused = false;
  /** Emits whether every rule is satisfied. */
  @Output() validChange = new EventEmitter<boolean>();

  segments = [0, 1, 2, 3];

  ngOnInit(): void {
    this.emitValidity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.emitValidity();
    }
  }

  get visible(): boolean {
    return this.focused || this.value.length > 0;
  }

  get rules(): PasswordRule[] {
    const v = this.value;
    return [
      { id: 'length', label: 'At least 8 characters', met: v.length >= 8 },
      { id: 'upper', label: 'One uppercase letter', met: /[A-Z]/.test(v) },
      { id: 'lower', label: 'One lowercase letter', met: /[a-z]/.test(v) },
      { id: 'number', label: 'One number', met: /\d/.test(v) },
      { id: 'special', label: 'One special character', met: /[^A-Za-z0-9]/.test(v) },
    ];
  }

  get metCount(): number {
    return this.rules.filter((r) => r.met).length;
  }

  get valid(): boolean {
    return this.metCount === 5;
  }

  get litSegments(): number {
    if (this.metCount === 5) {
      return 4;
    }
    if (this.metCount >= 3) {
      return 3;
    }
    if (this.metCount >= 2) {
      return 2;
    }
    if (this.metCount >= 1) {
      return 1;
    }
    return 0;
  }

  get strengthLevel(): StrengthLevel {
    if (this.metCount === 5) {
      return 'strong';
    }
    if (this.metCount === 4) {
      return 'good';
    }
    if (this.metCount >= 2) {
      return 'fair';
    }
    return 'weak';
  }

  get strengthLabel(): string {
    if (!this.value) {
      return '';
    }
    switch (this.metCount) {
      case 5:
        return 'Strong';
      case 4:
        return 'Good';
      case 2:
      case 3:
        return 'Fair';
      default:
        return 'Weak';
    }
  }

  private emitValidity(): void {
    this.validChange.emit(this.valid);
  }
}