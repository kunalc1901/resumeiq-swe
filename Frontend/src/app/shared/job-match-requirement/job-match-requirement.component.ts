import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { JobMatchRequirement } from '../../core/models/job-match.model';
import {
  categoryInfo,
  importanceInfo,
  matchStatusInfo,
  matchTypeInfo,
  priorityInfo,
  tagClassFor,
} from '../../core/utils/job-match.util';
import { AppIconComponent } from '../app-icon/app-icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  selector: 'app-job-match-requirement',
  template: `
    <article class="req-card dash-card">
      <div class="req-head">
        <h4 class="req-text">{{ requirement.requirement }}</h4>
        <span class="tag" [class]="tagClassFor(status.tone)">
          <app-icon [name]="status.icon" [size]="13" />
          {{ status.label }}
        </span>
      </div>

      <div class="req-meta">
        <span class="tag" [class]="tagClassFor(category.tone)">
          <app-icon [name]="category.icon" [size]="13" />
          {{ category.label }}
        </span>
        <span class="tag" [class]="tagClassFor(priority.tone)">
          <app-icon [name]="priority.icon" [size]="13" />
          {{ priority.label }}
        </span>
        <span class="tag" [class]="tagClassFor(type.tone)">
          <app-icon [name]="type.icon" [size]="13" />
          {{ type.label }}
        </span>
        <span class="req-importance">
          <app-icon name="zap" [size]="13" />
          Importance {{ requirement.importance }}
        </span>
      </div>

      <div class="req-evidence" *ngIf="requirement.resumeEvidence">
        <span class="req-evidence-label">Resume Evidence</span>
        <p class="req-evidence-text">{{ requirement.resumeEvidence }}</p>
      </div>

      <div class="req-reason">
        <span class="req-reason-label">Why</span>
        <p class="req-reason-text">{{ requirement.reason || 'No reason provided.' }}</p>
      </div>
    </article>
  `,
  styles: [
    `
      .req-card {
        padding: 18px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border-left: 3px solid var(--border-strong);
        transition: border-color 0.22s ease, transform 0.22s ease,
          box-shadow 0.22s ease;
      }
      .req-card:hover {
        border-left-color: var(--accent-indigo);
        transform: translateY(-2px);
        box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.5);
      }
      .req-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }
      .req-text {
        font-size: 14.5px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
        line-height: 1.5;
      }
      .req-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .req-importance {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--text-secondary);
      }
      .req-evidence,
      .req-reason {
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-subtle);
      }
      .req-evidence-label,
      .req-reason-label {
        display: block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 4px;
      }
      .req-evidence-text,
      .req-reason-text {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: var(--text-secondary);
      }
    `,
  ],
})
export class JobMatchRequirementComponent {
  @Input() requirement!: JobMatchRequirement;

  tagClassFor = tagClassFor;

  get status() {
    return matchStatusInfo(this.requirement.matchStatus);
  }
  get category() {
    return categoryInfo(this.requirement.category);
  }
  get priority() {
    return priorityInfo(this.requirement.priority);
  }
  get type() {
    return matchTypeInfo(this.requirement.matchType);
  }
  get importance() {
    return importanceInfo(String(this.requirement.importance));
  }
}