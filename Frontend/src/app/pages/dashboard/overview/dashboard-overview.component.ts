import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, SubscriptionService } from '../../../core/services';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ActivityGroup, Insight, ResumeStatus, Stat } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/stat-card/stat-card.component';
import { ScoreRingComponent } from '../../../shared/score-ring/score-ring.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { PremiumBadgeComponent } from '../../../shared/premium-badge/premium-badge.component';
import { TruncateTitleDirective } from '../../../shared/truncate-title/truncate-title.directive';

@Component({
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
  resumeStatus: ResumeStatus | null = null;
  stats: Stat[] = [];
  insights: Insight[] = [];
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

    this.dashboardService.getResumeStatus().subscribe((s) => (this.resumeStatus = s));
    this.dashboardService.getStats().subscribe((s) => (this.stats = s));
    this.dashboardService.getInsights().subscribe((i) => (this.insights = i));
    this.dashboardService.getRecentActivity().subscribe((a) => (this.activity = a));
  }
}