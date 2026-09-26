import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { USAGE_LABELS } from '../../../core/constants/plan.config';
import { UsageKind } from '../../../core/models/subscription.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { PremiumBadgeComponent } from '../../../shared/premium-badge/premium-badge.component';
import { UsageProgressComponent } from '../../../shared/usage-progress/usage-progress.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';

interface UsageRow {
  kind: UsageKind;
  icon: string;
}

const ROWS: UsageRow[] = [
  { kind: 'resumeSlots', icon: 'file-text' },
  { kind: 'resumeAnalyses', icon: 'zap' },
  { kind: 'jobMatches', icon: 'target' },
  { kind: 'resumeQuestions', icon: 'message-square' },
  { kind: 'interviewSessions', icon: 'mic' },
];

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AppIconComponent,
    PageHeaderComponent,
    PremiumBadgeComponent,
    UsageProgressComponent,
    EmptyStateComponent,
  ],
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss'],
})
export class UsageComponent {
  rows = ROWS;

  constructor(public subscription: SubscriptionService) {}

  labelOf(kind: UsageKind): string {
    return USAGE_LABELS[kind].name;
  }

  unitOf(kind: UsageKind): string {
    return USAGE_LABELS[kind].unit;
  }

  unitSingularOf(kind: UsageKind): string {
    return USAGE_LABELS[kind].unitSingular;
  }

  get allAiZero(): boolean {
    const s = this.subscription.state;
    if (s.loading || s.error) {
      return false;
    }
    const aiKinds: UsageKind[] = [
      'resumeAnalyses',
      'jobMatches',
      'resumeQuestions',
      'interviewSessions',
    ];
    return aiKinds.every((k) => s.usage[k].used === 0);
  }

  isWarning(kind: UsageKind): boolean {
    const tone = this.subscription.toneOf(kind);
    return tone === 'close' || tone === 'almost';
  }

  isExhausted(kind: UsageKind): boolean {
    return this.subscription.toneOf(kind) === 'exhausted';
  }

  retry(): void {
    this.subscription.reload();
  }
}