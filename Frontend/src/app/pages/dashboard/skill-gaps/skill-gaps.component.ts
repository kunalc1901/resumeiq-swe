import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { SkillGapData } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { PremiumBadgeComponent } from '../../../shared/premium-badge/premium-badge.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AppIconComponent,
    PageHeaderComponent,
    ProgressBarComponent,
    PremiumBadgeComponent,
  ],
  selector: 'app-skill-gaps',
  templateUrl: './skill-gaps.component.html',
  styleUrls: ['./skill-gaps.component.scss'],
})
export class SkillGapsComponent implements OnInit {
  data: SkillGapData | null = null;

  constructor(
    private dashboardService: DashboardService,
    public subscription: SubscriptionService,
  ) {}

  get isPremium(): boolean {
    return this.subscription.isPremium();
  }

  ngOnInit(): void {
    this.subscription.load();
    this.dashboardService.getSkillGaps().subscribe((d) => (this.data = d));
  }
}