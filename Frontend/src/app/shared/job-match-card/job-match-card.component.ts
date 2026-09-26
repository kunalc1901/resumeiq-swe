import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobMatch } from '../../core/models/job-match.model';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { ScoreRingComponent } from '../score-ring/score-ring.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent, ScoreRingComponent],
  selector: 'app-job-match-card',
  template: `
    <a
      class="jm-card dash-card dash-card-pad dash-card-hover"
      [routerLink]="['/dashboard/job-match', match.id]"
      [attr.aria-label]="'View analysis for ' + match.job.title"
    >
      <div class="jm-card-head">
        <div class="jm-card-title-wrap">
          <h3 class="jm-card-title">{{ match.job.title }}</h3>
          <span class="tag tag-accent">{{ match.job.seniority }}</span>
          <span class="jm-card-date" *ngIf="match.analyzedAt">{{ match.analyzedAt }}</span>
        </div>
        <app-score-ring [value]="match.matchScore" [size]="72">
          <div class="jm-card-score">
            <strong>{{ match.matchScore }}</strong>
            <span>%</span>
          </div>
        </app-score-ring>
      </div>

      <div class="jm-card-label">
        <app-icon name="target" [size]="13" />
        {{ match.matchLabel }}
      </div>

      <p class="jm-card-summary">{{ match.job.summary }}</p>

      <div class="jm-card-foot">
        <span class="jm-card-view">
          View Analysis
          <app-icon name="arrow-right" [size]="14" />
        </span>
      </div>
    </a>
  `,
  styles: [
    `
      .jm-card {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: inherit;
        height: 100%;
        gap: 12px;
      }
      .jm-card-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }
      .jm-card-title-wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        min-width: 0;
      }
      .jm-card-title {
        font-size: 16.5px;
        font-weight: 700;
        margin: 0;
        color: var(--text-primary);
        line-height: 1.3;
      }
      .jm-card-date {
        font-size: 12px;
        color: var(--text-muted);
      }
      .jm-card-score {
        display: flex;
        align-items: baseline;
        gap: 2px;
      }
      .jm-card-score strong {
        font-size: 20px;
        font-weight: 800;
        color: var(--text-primary);
      }
      .jm-card-score span {
        font-size: 12px;
        color: var(--text-muted);
      }
      .jm-card-label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #c7d2fe;
      }
      .jm-card-summary {
        font-size: 13px;
        line-height: 1.6;
        color: var(--text-secondary);
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .jm-card-foot {
        margin-top: auto;
        padding-top: 6px;
      }
      .jm-card-view {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #a5b4fc;
        transition: color 0.18s ease;
      }
      .jm-card:hover .jm-card-view {
        color: #c7d2fe;
      }
    `,
  ],
})
export class JobMatchCardComponent {
  @Input() match!: JobMatch;
}