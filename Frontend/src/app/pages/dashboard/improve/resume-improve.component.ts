import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { FEATURE_IDS } from '../../../core/constants/feature-ids';
import { ImprovementData } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { CollapsibleSectionComponent } from '../../../shared/collapsible-section/collapsible-section.component';
import { PremiumBadgeComponent } from '../../../shared/premium-badge/premium-badge.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AppIconComponent,
    PageHeaderComponent,
    CollapsibleSectionComponent,
    PremiumBadgeComponent,
  ],
  selector: 'app-resume-improve',
  templateUrl: './resume-improve.component.html',
  styleUrls: ['./resume-improve.component.scss'],
})
export class ResumeImproveComponent implements OnInit {
  data: ImprovementData | null = null;

  constructor(
    private dashboardService: DashboardService,
    public subscription: SubscriptionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription.load();
    this.dashboardService.getImprovementData().subscribe((d) => (this.data = d));
  }

  get isPremium(): boolean {
    return this.subscription.isPremium();
  }

  get accessLabel(): string {
    return this.subscription.accessOf(FEATURE_IDS.RESUME_IMPROVEMENT);
  }

  explorePremium(): void {
    this.router.navigate(['/dashboard/upgrade']);
  }
}