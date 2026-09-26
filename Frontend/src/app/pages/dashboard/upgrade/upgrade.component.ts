import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionService } from '../../../core/services/subscription.service';
import {
  PLAN_COMPARISON,
  PlanComparisonRow,
  PLANS,
} from '../../../core/constants/plan.config';
import { PlanCardComponent } from '../../../shared/plan-card/plan-card.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AppIconComponent,
    PageHeaderComponent,
    PlanCardComponent,
  ],
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
})
export class UpgradeComponent {
  comparison: PlanComparisonRow[] = PLAN_COMPARISON;

  checkoutOpen = false;
  upgrading = false;
  upgraded = false;

  constructor(
    public subscription: SubscriptionService,
    private router: Router,
  ) {}

  get isPremium(): boolean {
    return this.subscription.isPremium();
  }

  get isMock(): boolean {
    return this.subscription.isMockMode();
  }

  freePlan(): typeof PLANS.free {
    return PLANS.free;
  }

  premiumPlan(): typeof PLANS.premium {
    return PLANS.premium;
  }

  freeFeatures(): string[] {
    const l = PLANS.free.monthlyLimits;
    return [
      `${l.resumeSlots} resume slots`,
      `${l.resumeAnalyses} AI analyses / month`,
      `${l.jobMatches} Job Matches / month`,
      `${l.resumeQuestions} Resume Q&A questions / month`,
      `${l.interviewSessions} Interview session / month`,
      'Limited resume improvement',
      'Basic skill gap analysis',
    ];
  }

  premiumFeatures(): string[] {
    const l = PLANS.premium.monthlyLimits;
    return [
      `${l.resumeSlots} resume slots`,
      `${l.resumeAnalyses} AI analyses / month`,
      `${l.jobMatches} Job Matches / month`,
      `${l.resumeQuestions} Resume Q&A questions / month`,
      `${l.interviewSessions} Interview sessions / month`,
      'Full resume improvement',
      'Advanced skill gap analysis',
      'Advanced features included',
      'AI Career Assistant — Coming Soon',
    ];
  }

  openCheckout(): void {
    this.checkoutOpen = true;
  }

  closeCheckout(): void {
    this.checkoutOpen = false;
  }

  continueWithFree(): void {
    this.router.navigate(['/dashboard/overview']);
  }

  simulateUpgrade(): void {
    this.upgrading = true;
    this.subscription.upgrade().subscribe((res) => {
      this.upgrading = false;
      this.checkoutOpen = false;
      this.upgraded = res.ok;
    });
  }
}