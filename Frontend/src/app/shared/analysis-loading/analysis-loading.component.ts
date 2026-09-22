import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  selector: 'app-analysis-loading',
  template: `
    <div class="analysis-loading" role="status" aria-live="polite">
      <div class="al-icon" aria-hidden="true">
        <app-icon name="cpu" [size]="28" />
      </div>
      <h3 class="al-title">{{ title }}</h3>
      <ul class="al-steps">
        <li
          *ngFor="let step of steps; let i = index"
          [class.done]="state(i) === 'done'"
          [class.active]="state(i) === 'active'"
        >
          <span class="step-marker" aria-hidden="true">
            <ng-container [ngSwitch]="state(i)">
              <span *ngSwitchCase="'done'">&#10003;</span>
              <span *ngSwitchCase="'active'">&#9679;</span>
              <span *ngSwitchDefault>&#9675;</span>
            </ng-container>
          </span>
          {{ step }}
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .analysis-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 56px 24px;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        background: var(--bg-card);
      }
      .al-icon {
        width: 64px;
        height: 64px;
        border-radius: 20px;
        display: grid;
        place-items: center;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.2),
          rgba(139, 92, 246, 0.14)
        );
        border: 1px solid rgba(129, 140, 248, 0.32);
        color: #a5b4fc;
        margin-bottom: 20px;
        animation: alPulse 2s ease-in-out infinite;
      }
      @keyframes alPulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.25);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
        }
      }
      .al-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 22px;
        color: var(--text-primary);
      }
      .al-steps {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 12px;
        text-align: left;
        width: 100%;
        max-width: 360px;
      }
      .al-steps li {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: var(--text-muted);
        transition: color 0.3s ease;
      }
      .al-steps li.active {
        color: var(--text-primary);
      }
      .al-steps li.done {
        color: var(--text-secondary);
      }
      .step-marker {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 12px;
        border: 1px solid var(--border-subtle);
        background: rgba(255, 255, 255, 0.03);
        flex: none;
      }
      .al-steps li.done .step-marker {
        color: #34d399;
        border-color: rgba(52, 211, 153, 0.4);
        background: rgba(52, 211, 153, 0.08);
      }
      .al-steps li.active .step-marker {
        color: #a5b4fc;
        border-color: rgba(129, 140, 248, 0.5);
        background: rgba(99, 102, 241, 0.12);
      }
      @media (prefers-reduced-motion: reduce) {
        .al-icon {
          animation: none;
        }
      }
    `,
  ],
})
export class AnalysisLoadingComponent implements OnInit, OnDestroy {
  @Input() title = 'Analyzing your resume...';
  @Input() steps: string[] = [];
  @Output() complete = new EventEmitter<void>();

  current = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    let i = 0;
    this.timer = setInterval(() => {
      i++;
      if (i >= this.steps.length) {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.current = this.steps.length;
        this.cdr.detectChanges();
        setTimeout(() => this.complete.emit(), 500);
        return;
      }
      this.current = i;
      this.cdr.detectChanges();
    }, 750);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  state(i: number): 'done' | 'active' | 'pending' {
    if (i < this.current) {
      return 'done';
    }
    if (i === this.current && this.current < this.steps.length) {
      return 'active';
    }
    return 'pending';
  }
}