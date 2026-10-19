import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { FEATURE_IDS } from '../../../core/constants/feature-ids';
import { ChatMessage } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { UsageLimitCardComponent } from '../../../shared/usage-limit-card/usage-limit-card.component';

/** Older conversation shown in the history overlay (UI mock - no backend yet). */
interface QaConversation {
  id: string;
  title: string;
  time: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
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

  /** History overlay state + mock older conversations (UI only for now). */
  historyOpen = false;
  activeConversationId = '';
  conversations: QaConversation[] = [
    { id: 'c1', title: 'Senior Full-Stack role fit', time: 'Yesterday' },
    { id: 'c2', title: 'Improving my resume summary', time: '3 days ago' },
    { id: 'c3', title: 'Skills for cloud engineering roles', time: 'Last week' },
    { id: 'c4', title: 'Explaining my ATS score', time: '2 weeks ago' },
    { id: 'c5', title: 'Project impact bullet points', time: 'Sep 28' },
    { id: 'c6', title: 'Is my experience enough for a lead role?', time: 'Sep 21' },
  ];

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

  /** Opens/closes the older-conversations overlay. */
  toggleHistory(): void {
    this.historyOpen = !this.historyOpen;
  }

  closeHistory(): void {
    this.historyOpen = false;
  }

  /** UI only: highlights the chosen conversation and closes the overlay. */
  selectConversation(id: string): void {
    this.activeConversationId = id;
    this.historyOpen = false;
  }

  /** UI only: clears the visible chat and starts a fresh conversation. */
  newChat(): void {
    this.messages = [];
    this.input = '';
    this.typing = false;
    this.activeConversationId = '';
    this.historyOpen = false;
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