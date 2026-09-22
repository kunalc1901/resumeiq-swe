import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/dashboard.service';
import { JobMatchResult } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ScoreRingComponent } from '../../../shared/score-ring/score-ring.component';
import { AnalysisLoadingComponent } from '../../../shared/analysis-loading/analysis-loading.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';

type MatchMode = 'idle' | 'loading' | 'done';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppIconComponent,
    PageHeaderComponent,
    ScoreRingComponent,
    AnalysisLoadingComponent,
    EmptyStateComponent,
  ],
  selector: 'app-job-match',
  templateUrl: './job-match.component.html',
  styleUrls: ['./job-match.component.scss'],
})
export class JobMatchComponent {
  mode: MatchMode = 'idle';
  result: JobMatchResult | null = null;
  errorMsg = '';
  selectedResume = 'Software_Engineer_Resume.pdf';
  jdText = '';

  steps = [
    'Extracting resume content',
    'Understanding your experience',
    'Matching against job description',
    'Preparing recommendations',
  ];

  constructor(private dashboardService: DashboardService) {}

  analyze(): void {
    if (!this.jdText.trim()) {
      this.errorMsg = 'Paste a job description to analyze.';
      return;
    }
    this.errorMsg = '';
    this.mode = 'loading';
    this.result = null;
  }

  onLoadingComplete(): void {
    this.dashboardService.getJobMatchResult().subscribe((r) => {
      this.result = r;
      this.mode = 'done';
    });
  }

  reset(): void {
    this.mode = 'idle';
    this.result = null;
  }
}