import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ChatMessage } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent, PageHeaderComponent],
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
    private cdr: ChangeDetectorRef,
  ) {}

  get userMessages(): ChatMessage[] {
    return this.messages.filter((m) => m.role === 'user');
  }

  get assistantMessages(): ChatMessage[] {
    return this.messages.filter((m) => m.role === 'assistant');
  }

  ngOnInit(): void {
    this.dashboardService.getSuggestedQuestions().subscribe((q) => (this.suggestedQuestions = q));
  }

  send(text?: string): void {
    const content = (text ?? this.input).trim();
    if (!content) {
      return;
    }
    this.messages.push({ id: this.uid(), role: 'user', content });
    this.input = '';
    this.typing = true;
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

  private scrollToBottom(): void {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  private uid(): string {
    return Math.random().toString(36).slice(2, 10);
  }
}