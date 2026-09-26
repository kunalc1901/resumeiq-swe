import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { JobMatchService } from '../../../core/services/job-match.service';
import { FEATURE_IDS } from '../../../core/constants/feature-ids';
import { JobMatch } from '../../../core/models/job-match.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { AnalysisLoadingComponent } from '../../../shared/analysis-loading/analysis-loading.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { UsageLimitCardComponent } from '../../../shared/usage-limit-card/usage-limit-card.component';
import { JobMatchCardComponent } from '../../../shared/job-match-card/job-match-card.component';

type MatchMode = 'idle' | 'loading' | 'limit';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppIconComponent,
    PageHeaderComponent,
    AnalysisLoadingComponent,
    EmptyStateComponent,
    UsageLimitCardComponent,
    JobMatchCardComponent,
  ],
  selector: 'app-job-match',
  templateUrl: './job-match.component.html',
  styleUrls: ['./job-match.component.scss'],
})
export class JobMatchComponent implements OnInit {
  mode: MatchMode = 'idle';
  errorMsg = '';
  analyzeError = false;
  selectedResume = 'Software_Engineer_Resume.pdf';
  jdText = '';

  history: JobMatch[] = [];
  historyLoading = true;
  historyError = false;

  steps = [
    'Extracting resume content',
    'Understanding your experience',
    'Matching against job description',
    'Preparing recommendations',
  ];

  constructor(
    private jobMatchService: JobMatchService,
    public subscription: SubscriptionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription.load();
    this.loadHistory();
  }

  get matchesRemainingLabel(): string {
    return this.subscription.remainingLabel('jobMatches');
  }

  get resetLabel(): string {
    return this.subscription.resetLabel();
  }

  loadHistory(): void {
    this.historyLoading = true;
    this.historyError = false;
    this.jobMatchService.getHistory().subscribe({
      next: (matches) => {
        this.history = matches;
        this.historyLoading = false;
      },
      error: () => {
        this.historyLoading = false;
        this.historyError = true;
      },
    });
  }

  analyze(): void {
    if (!this.subscription.canUse(FEATURE_IDS.JOB_MATCH)) {
      this.mode = 'limit';
      return;
    }
    if (!this.jdText.trim()) {
      this.errorMsg = 'Paste a job description to analyze.';
      this.analyzeError = true;
      return;
    }
    this.errorMsg = '';
    this.analyzeError = false;
    this.mode = 'loading';
  }

  onLoadingComplete(): void {
    this.jobMatchService.analyzeMatch(this.jdText).subscribe({
      next: (match) => {
        this.history = [match, ...this.history];
        this.mode = 'idle';
        this.subscription.consume('jobMatches');
        this.router.navigate(['/dashboard/job-match', match.id]);
      },
      error: () => {
        this.mode = 'idle';
        this.errorMsg = "We couldn't complete the analysis. Please try again.";
        this.analyzeError = true;
      },
    });
  }

  reset(): void {
    this.mode = 'idle';
  }

  goUpgrade(): void {
    this.router.navigate(['/dashboard/upgrade']);
  }

  viewUsage(): void {
    this.router.navigate(['/dashboard/usage']);
  }
}