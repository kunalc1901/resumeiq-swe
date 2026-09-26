import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobMatchService } from '../../../core/services/job-match.service';
import {
  JobMatch,
  JobMatchScoreBreakdown,
} from '../../../core/models/job-match.model';
import {
  categoryInfo,
  importanceInfo,
  matchLabelFallback,
  matchSentence,
  matchStatusInfo,
  matchStrengthInfo,
  matchTypeInfo,
  priorityInfo,
  relevanceInfo,
  scorePercent,
  tagClassFor,
} from '../../../core/utils/job-match.util';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { ScoreRingComponent } from '../../../shared/score-ring/score-ring.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { JobMatchRequirementComponent } from '../../../shared/job-match-requirement/job-match-requirement.component';

interface BreakdownRow {
  title: string;
  icon: string;
  score: number;
  maxScore: number;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AppIconComponent,
    ScoreRingComponent,
    ProgressBarComponent,
    EmptyStateComponent,
    JobMatchRequirementComponent,
  ],
  selector: 'app-job-match-detail',
  templateUrl: './job-match-detail.component.html',
  styleUrls: ['./job-match-detail.component.scss'],
})
export class JobMatchDetailComponent implements OnInit, OnDestroy {
  match: JobMatch | null = null;
  loading = true;
  notFound = false;
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;

  // Exposed for template use.
  tagClassFor = tagClassFor;
  matchStatusInfo = matchStatusInfo;
  matchTypeInfo = matchTypeInfo;
  importanceInfo = importanceInfo;
  priorityInfo = priorityInfo;
  categoryInfo = categoryInfo;
  relevanceInfo = relevanceInfo;
  matchStrengthInfo = matchStrengthInfo;
  scorePercent = scorePercent;

  constructor(
    private route: ActivatedRoute,
    private service: JobMatchService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.service.getById(id).subscribe({
      next: (m) => {
        this.clearFallback();
        this.match = m;
        this.loading = false;
        this.notFound = !m;
      },
      error: () => {
        this.clearFallback();
        this.loading = false;
        this.notFound = true;
      },
    });
    // Safety net: never leave the user stuck on skeletons.
    this.fallbackTimer = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.notFound = true;
      }
    }, 4000);
  }

  ngOnDestroy(): void {
    this.clearFallback();
  }

  private clearFallback(): void {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  get label(): string {
    return this.match?.matchLabel || matchLabelFallback(this.match?.matchScore ?? 0);
  }

  get sentence(): string {
    return matchSentence(this.label);
  }

  get breakdownRows(): BreakdownRow[] {
    const b = this.match?.scoreBreakdown;
    if (!b) {
      return [];
    }
    const defs: { key: keyof JobMatchScoreBreakdown; title: string; icon: string }[] = [
      { key: 'requiredSkills', title: 'Required Skills', icon: 'code' },
      { key: 'responsibilities', title: 'Responsibilities', icon: 'briefcase' },
      { key: 'experience', title: 'Experience', icon: 'trending-up' },
      { key: 'preferredQualifications', title: 'Preferred Qualifications', icon: 'star' },
      { key: 'projectsDomainRelevance', title: 'Projects & Domain', icon: 'layers' },
      { key: 'educationCertifications', title: 'Education & Certifications', icon: 'graduation-cap' },
      { key: 'keywordAlignment', title: 'Keyword Alignment', icon: 'search' },
    ];
    return defs.map((d) => ({
      title: d.title,
      icon: d.icon,
      score: b[d.key].score,
      maxScore: b[d.key].maxScore,
    }));
  }

  /** Zero-padded index for numbered lists, e.g. 1 -> '01'. */
  numLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}