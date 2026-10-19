import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, SubscriptionService } from '../../../core/services';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ActivityGroup, ResumeStatus, Stat } from '../../../core/models/dashboard.model';
import { ResumeAnalysisPayload, ResumeRecord } from '../../../core/models/resume.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/stat-card/stat-card.component';
import { ScoreRingComponent } from '../../../shared/score-ring/score-ring.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { PremiumBadgeComponent } from '../../../shared/premium-badge/premium-badge.component';
import { TruncateTitleDirective } from '../../../shared/truncate-title/truncate-title.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AppIconComponent,
    PageHeaderComponent,
    StatCardComponent,
    ScoreRingComponent,
    ProgressBarComponent,
    PremiumBadgeComponent,
    TruncateTitleDirective,
  ],
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss'],
})
export class DashboardOverviewComponent implements OnInit {
  resumeStatus = signal<ResumeStatus | null>(null);
  stats = signal<Stat[]>([]);
  activity: ActivityGroup[] = [];

  greeting = 'Good morning';
  firstName = 'John';

  quickActions = [
    { label: 'Analyze Resume', desc: 'Upload and analyze a new resume.', icon: 'upload', route: '/dashboard/resume' },
    { label: 'Match a Job', desc: 'Compare your resume with a job description.', icon: 'target', route: '/dashboard/job-match' },
    { label: 'Ask Your Resume', desc: 'Ask questions about your own experience.', icon: 'message-square', route: '/dashboard/resume-qa' },
    { label: 'Prepare for Interview', desc: 'Generate personalized interview questions.', icon: 'mic', route: '/dashboard/interview' },
  ];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    public subscription: SubscriptionService,
  ) {}

  get isPremium(): boolean {
    return this.subscription.isPremium();
  }

  ngOnInit(): void {
    this.subscription.load();
    const hour = new Date().getHours();
    this.greeting =
      hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const user = this.authService.getUser();
    this.firstName = user?.first_name || 'John';

    this.loadLatestAnalyzedResume();
    this.dashboardService.getRecentActivity().subscribe((a) => (this.activity = a));
  }

  /** Fetches the latest analysed resume and derives the resume card + stats. */
  private loadLatestAnalyzedResume(): void {
    this.dashboardService.getLatestAnalyzedResume().subscribe({
      next: (record) => {
        if (!record || !record.analysis) {
          this.resumeStatus.set(null);
          this.stats.set([]);
          return;
        }
        this.resumeStatus.set({
          fileName: record.file_name,
          overallScore: record.analysis.overall_score,
          atsScore: record.analysis.ats_score,
        });
        this.stats.set(this.toStats(record.analysis));
      },
      error: (err) => {
        console.error('Error occurred while fetching dashboard data, err:', err);
        this.resumeStatus.set(null);
        this.stats.set([]);
      },
    });
  }

  /** Maps the analysis payload to the quick stat cards. */
  private toStats(analysis: ResumeAnalysisPayload): Stat[] {
    const skillGroups = Object.values(analysis.skills ?? {});
    const skillCount = skillGroups.reduce(
      (total, skills) => total + (skills?.length ?? 0),
      0,
    );
    const improvements = analysis.improvements?.length ?? 0;
    return [
      {
        id: 'score',
        label: 'Overall Resume Score',
        value: `${analysis.overall_score}`,
        sub: 'out of 100',
        icon: 'star',
        tone: 'accent',
        progress: analysis.overall_score,
      },
      {
        id: 'ats',
        label: 'ATS Compatibility',
        value: `${analysis.ats_score}%`,
        sub: 'parses cleanly',
        icon: 'file-text',
        tone: 'success',
        progress: analysis.ats_score,
      },
      {
        id: 'skills',
        label: 'Skills Identified',
        value: `${skillCount}`,
        sub: `across ${skillGroups.length} group${skillGroups.length === 1 ? '' : 's'}`,
        icon: 'layers',
        tone: 'info',
      },
      {
        id: 'gaps',
        label: 'Areas to Improve',
        value: `${improvements}`,
        sub: 'actionable items',
        icon: 'alert-triangle',
        tone: 'warn',
      },
    ];
  }
}
