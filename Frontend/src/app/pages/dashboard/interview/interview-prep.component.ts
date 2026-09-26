import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { FEATURE_IDS } from '../../../core/constants/feature-ids';
import {
  InterviewEvaluation,
  InterviewQuestion,
} from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { UsageLimitCardComponent } from '../../../shared/usage-limit-card/usage-limit-card.component';

type InterviewPhase = 'setup' | 'intro' | 'answering' | 'evaluating' | 'limit';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppIconComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ProgressBarComponent,
    UsageLimitCardComponent,
  ],
  selector: 'app-interview-prep',
  templateUrl: './interview-prep.component.html',
  styleUrls: ['./interview-prep.component.scss'],
})
export class InterviewPrepComponent {
  interviewTypes = ['Technical', 'Behavioral', 'Project-based', 'HR'];
  difficulties = ['Easy', 'Medium', 'Hard'];

  selectedType = 'Technical';
  targetRole = 'Full Stack Developer';
  selectedDifficulty = 'Medium';

  phase: InterviewPhase = 'setup';
  questions: InterviewQuestion[] = [];
  currentIndex = 0;
  totalQuestions = 10;
  answer = '';
  evaluation: InterviewEvaluation | null = null;
  evaluating = false;

  constructor(
    private dashboardService: DashboardService,
    public subscription: SubscriptionService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  get currentQuestion(): InterviewQuestion | null {
    return this.questions.length ? this.questions[this.currentIndex] : null;
  }

  get questionNumber(): string {
    return String(this.currentIndex + 1).padStart(2, '0');
  }

  get sessionsRemainingLabel(): string {
    return this.subscription.remainingLabel('interviewSessions');
  }

  get canStart(): boolean {
    return this.subscription.canUse(FEATURE_IDS.INTERVIEW_PREP);
  }

  get resetLabel(): string {
    return this.subscription.resetLabel();
  }

  startInterview(): void {
    if (!this.canStart) {
      this.phase = 'limit';
      return;
    }
    this.dashboardService.getInterviewQuestions().subscribe((qs) => {
      this.questions = qs;
      this.currentIndex = 0;
      this.answer = '';
      this.evaluation = null;
      this.phase = 'intro';
      this.subscription.consume('interviewSessions');
    });
  }

  startAnswering(): void {
    this.phase = 'answering';
  }

  submitAnswer(): void {
    if (!this.answer.trim()) {
      return;
    }
    this.phase = 'evaluating';
    this.evaluating = true;
    this.dashboardService.getInterviewEvaluation().subscribe((ev) => {
      setTimeout(() => {
        this.evaluation = ev;
        this.evaluating = false;
        this.cdr.detectChanges();
      }, 800);
    });
  }

  nextQuestion(): void {
    this.evaluation = null;
    this.answer = '';
    this.phase = 'intro';
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  reset(): void {
    this.phase = 'setup';
    this.evaluation = null;
    this.answer = '';
  }

  goUpgrade(): void {
    this.router.navigate(['/dashboard/upgrade']);
  }

  viewUsage(): void {
    this.router.navigate(['/dashboard/usage']);
  }
}