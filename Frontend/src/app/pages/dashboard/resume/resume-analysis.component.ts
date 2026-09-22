import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ResumeAnalysis } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ScoreRingComponent } from '../../../shared/score-ring/score-ring.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { CollapsibleSectionComponent } from '../../../shared/collapsible-section/collapsible-section.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AppIconComponent,
    PageHeaderComponent,
    ScoreRingComponent,
    ProgressBarComponent,
    CollapsibleSectionComponent,
    EmptyStateComponent,
  ],
  selector: 'app-resume-analysis',
  templateUrl: './resume-analysis.component.html',
  styleUrls: ['./resume-analysis.component.scss'],
})
export class ResumeAnalysisComponent implements OnInit {
  analysis: ResumeAnalysis | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getResumeAnalysis().subscribe((a) => (this.analysis = a));
  }
}