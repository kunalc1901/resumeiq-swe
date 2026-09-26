import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { FEATURE_IDS } from '../../../core/constants/feature-ids';
import { ChatMessage } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { UsageLimitCardComponent } from '../../../shared/usage-limit-card/usage-limit-card.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppIconComponent,
    PageHeaderComponent,
    UsageLimitCardComponent,
  ],
  selector: 'app-resume-qa',
  templateUrl: './resume-qa.component.html',
  styleUrls: ['./resume-qa.component.scss'],
})
export class ResumeQaComponent implements OnInit {
  messages: ChatMessage[] = [];
  suggestedQuestions: string[] = [];
  input = '';
  typing = false;

  constructor(
    private dashboardService: DashboardService,
    public subscription: SubscriptionService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  get userMessages(): ChatMessage[] {
    return this.messages.filter((m) => m.role === 'user');
  }

  get assistantMessages(): ChatMessage[] {
    return this.messages.filter((m) => m.role === 'assistant');
  }

  get questionsUsedLabel(): string {
    return this.subscription.usageLabel('resumeQuestions');
  }

  get questionsRemaining(): number {
    return this.subscription.remainingOf('resumeQuestions');
  }

  get canAsk(): boolean {
    return this.subscription.canUse(FEATURE_IDS.RESUME_QA);
  }

  get isLow(): boolean {
    const tone = this.subscription.toneOf('resumeQuestions');
    return tone === 'close' || tone === 'almost';
  }

  ngOnInit(): void {
    this.subscription.load();
    this.dashboardService.getSuggestedQuestions().subscribe((q) => (this.suggestedQuestions = q));
  }

  send(text?: string): void {
    const content = (text ?? this.input).trim();
    if (!content || !this.canAsk) {
      return;
    }
    this.messages.push({ id: this.uid(), role: 'user', content });
    this.input = '';
    this.typing = true;
    this.subscription.consume('resumeQuestions');
    this.scrollToBottom();

    this.dashboardService.getQaAnswer(content).subscribe((res) => {
      setTimeout(() => {
        this.typing = false;
        this.messages.push({
          id: this.uid(),
          role: 'assistant',
          content: res.answer,
          source: res.source,
        });
        this.cdr.detectChanges();
        this.scrollToBottom();
      }, 900);
    });
  }

  ask(text: string): void {
    this.send(text);
  }

  goUpgrade(): void {
    this.router.navigate(['/dashboard/upgrade']);
  }

  viewUsage(): void {
    this.router.navigate(['/dashboard/usage']);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  private uid(): string {
    return Math.random().toString(36).slice(2, 10);
  }
}