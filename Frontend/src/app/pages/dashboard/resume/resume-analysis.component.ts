import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { NotificationService } from '../../../core/services/notifications.service';
import { ResumeService } from '../../../core/services/resume.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { FEATURE_IDS } from '../../../core/constants/feature-ids';
import { ResumeAnalysis } from '../../../core/models/dashboard.model';
import { ResumeRecord } from '../../../core/models/resume.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ScoreRingComponent } from '../../../shared/score-ring/score-ring.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { CollapsibleSectionComponent } from '../../../shared/collapsible-section/collapsible-section.component';
import { UpgradeModalComponent } from '../../../shared/upgrade-modal/upgrade-modal.component';
import { ResumeUploadModalComponent } from '../../../shared/resume-upload-modal/resume-upload-modal.component';
import { TruncateTitleDirective } from '../../../shared/truncate-title/truncate-title.directive';

interface ResumeCard {
  id: string;
  fileName: string;
  uploadedAt: string;
  overallScore: number | null;
  atsScore: number | null;
  analyzed: boolean;
  selected: boolean;
  analysis: ResumeAnalysis | null;
}

interface BreakdownRow {
  label: string;
  value: number;
  max: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    CommonModule,
    AppIconComponent,
    PageHeaderComponent,
    ScoreRingComponent,
    ProgressBarComponent,
    CollapsibleSectionComponent,
    UpgradeModalComponent,
    ResumeUploadModalComponent,
    TruncateTitleDirective,
  ],
  selector: 'app-resume-analysis',
  templateUrl: './resume-analysis.component.html',
  styleUrls: ['./resume-analysis.component.scss'],
})
export class ResumeAnalysisComponent implements OnInit {
  resumes = signal<ResumeCard[]>([]);
  analysis = signal<ResumeAnalysis | null>(null);
  loading = signal(true);
  loadError = signal(false);
  analyzing = false;

  slotModalOpen = false;
  analysisModalOpen = false;
  uploadModalOpen = false;

  get overallBreakdown(): BreakdownRow[] {
    const b = this.analysis()?.scoreBreakdown;
    return [
      { label: 'Content Quality', value: b?.contentQuality ?? 0, max: 25 },
      { label: 'Experience & Impact', value: b?.experienceImpact ?? 0, max: 20 },
      { label: 'Skills Relevance', value: b?.skillsRelevance ?? 0, max: 15 },
      { label: 'Structure & Clarity', value: b?.structureClarity ?? 0, max: 15 },
      { label: 'Projects & Education', value: b?.projectsEducationCertifications ?? 0, max: 10 },
      { label: 'Professionalism', value: b?.professionalismConsistency ?? 0, max: 10 },
      { label: 'Completeness', value: b?.completeness ?? 0, max: 5 },
    ];
  }

  get atsBreakdown(): BreakdownRow[] {
    const b = this.analysis()?.atsScoreBreakdown;
    return [
      { label: 'Structure', value: b?.structure ?? 0, max: 25 },
      { label: 'Keywords & Terminology', value: b?.keywordTerminology ?? 0, max: 20 },
      { label: 'Experience Parsability', value: b?.experienceSkillsParsability ?? 0, max: 15 },
      { label: 'Formatting & Consistency', value: b?.formattingConsistency ?? 0, max: 15 },
      { label: 'Content Organization', value: b?.contentOrganization ?? 0, max: 10 },
      { label: 'Contact Parsability', value: b?.contactParsability ?? 0, max: 5 },
      { label: 'Date Consistency', value: b?.dateConsistency ?? 0, max: 5 },
    ];
  }

  constructor(
    private dashboardService: DashboardService,
    private resumeService: ResumeService,
    public subscription: SubscriptionService,
    private notificationsService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription.load();
    this.loadResumes();
  }

  get slotLabel(): string {
    const e = this.subscription.usageOf('resumeSlots');
    return `${e.used} of ${e.limit} slots used`;
  }

  get hasSlotsRemaining(): boolean {
    return this.subscription.canUse(FEATURE_IDS.RESUME_STORAGE);
  }

  get isPremium(): boolean {
    return this.subscription.isPremium();
  }

  get selectedResumeFileName(): string {
    const selected = this.resumes().find((r) => r.selected);
    return selected?.fileName || 'Resume';
  }

  /** Opens the resume upload dialog. Slot check happens before the dialog. */
  onUpload(): void {
    if (!this.hasSlotsRemaining) {
      this.slotModalOpen = true;
      return;
    }
    this.uploadModalOpen = true;
  }

  /**
   * Dialog confirmed: request a presigned URL, upload the file straight to S3
   * (tracking progress in the notification panel), then save the entry.
   */
  onResumeUpload(file: File): void {
    this.uploadModalOpen = false;
    const taskId = this.notificationsService.startUpload(file.name, file.size);

    this.resumeService.getUploadUrl(file).subscribe({
      next: ({ upload_url, key, file_name }) => {
        this.resumeService.uploadToS3(upload_url, file).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              const percent = Math.round((event.loaded / event.total) * 100);
              // Hold at 99% until the DB entry is saved.
              this.notificationsService.updateUpload(taskId, Math.min(percent, 99));
            }
          },
          error: (err) => {
            console.error(`Error occurred while uploading resume to S3, err:`, err);
            this.notificationsService.failUpload(taskId);
          },
          complete: () => {
            this.resumeService.createResume(key, file_name).subscribe({
              next: () => {
                this.notificationsService.completeUpload(taskId);
                this.subscription.consume('resumeSlots');
                this.loadResumes();
              },
              error: (err) => {
                console.error(`Error occurred while saving the resume, err:`, err);
                this.notificationsService.failUpload(taskId);
              },
            });
          },
        });
      },
      error: (err) => {
        console.error(`Error occurred while requesting a resume upload URL, err:`, err);
        this.notificationsService.failUpload(taskId);
      },
    });
  }

  /** Selecting a resume never consumes AI usage. */
  selectResume(resume: ResumeCard): void {
    this.resumes().forEach((r) => (r.selected = r.id === resume.id));
    this.resumes.set([...this.resumes()]);
    this.analysis.set(resume.analysis);
  }

  analyzeResume(resume: ResumeCard): void {
    if (resume.analyzed) {
      this.selectResume(resume);
      return;
    }
    if (!this.subscription.canUse(FEATURE_IDS.RESUME_ANALYSIS)) {
      this.analysisModalOpen = true;
      return;
    }
    this.analyzing = true;
    this.dashboardService.getResumeAnalysis().subscribe((a) => {
      resume.analysis = a;
      resume.analyzed = true;
      resume.overallScore = a.overallScore;
      resume.atsScore = a.atsScore;
      this.analysis.set(a);
      this.analyzing = false;
      this.resumes().forEach((r) => (r.selected = r.id === resume.id));
      this.resumes.set([...this.resumes()]);
      this.subscription.consume('resumeAnalyses');
    });
  }

  /** Deleting a resume frees a storage slot but never restores AI usage. */
  deleteResume(resume: ResumeCard): void {
    this.resumes.set(this.resumes().filter((r) => r.id !== resume.id));
    this.subscription.restore('resumeSlots');
    if (resume.selected) {
      this.analysis.set(null);
      const next = this.resumes()[0];
      if (next) {
        this.selectResume(next);
      }
    }
  }

  goUpgrade(): void {
    this.router.navigate(['/dashboard/upgrade']);
  }

  /** Fetches the user's resumes (newest first) and selects the latest one. */
  private loadResumes(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.resumeService.getResumes().subscribe({
      next: (records) => {
        const cards = [...records]
          .sort((a, b) => this.toTime(b.uploaded_at) - this.toTime(a.uploaded_at))
          .map((record) => this.toResumeCard(record));
        this.resumes.set(cards);
        this.loading.set(false);
        const latest = cards[0];
        if (latest) {
          this.selectResume(latest);
        } else {
          this.analysis.set(null);
        }
      },
      error: (err) => {
        console.error(`Error occurred while fetching resumes, err:`, err);
        this.resumes.set([]);
        this.analysis.set(null);
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  /** Maps a raw API resume document to the card model used in the strip. */
  private toResumeCard(record: ResumeRecord): ResumeCard {
    return {
      id: record._id,
      fileName: record.file_name,
      uploadedAt: this.relativeTime(record.uploaded_at),
      overallScore: record.analysis?.overall_score ?? null,
      atsScore: record.analysis?.ats_score ?? null,
      analyzed: !!record.analysis,
      selected: false,
      analysis: this.toAnalysis(record),
    };
  }

  /** Maps the API analysis payload to the view model used across the page. */
  private toAnalysis(record: ResumeRecord): ResumeAnalysis | null {
    const a = record.analysis;
    if (!a) {
      return null;
    }
    const breakdown = a.score_breakdown;
    const ats = a.ats_score_breakdown;
    return {
      fileName: record.file_name,
      overallScore: a.overall_score,
      atsScore: a.ats_score,
      summary: a.summary,
      skills: Object.entries(a.skills ?? {}).map(([group, skills]) => ({
        group,
        skills: skills ?? [],
      })),
      experience: (a.work_experience ?? []).map((work) => ({
        role: work.designation,
        company: work.company,
        period: [work.duration?.from, work.duration?.to].filter(Boolean).join(' - '),
        points: this.splitSummary(work.work_summary),
      })),
      projects: [],
      education:
        a.college || a.degree
          ? [{ degree: a.degree, institution: a.college, period: '' }]
          : [],
      scoreBreakdown: {
        contentQuality: breakdown?.content_quality ?? 0,
        experienceImpact: breakdown?.experience_impact ?? 0,
        skillsRelevance: breakdown?.skills_relevance ?? 0,
        structureClarity: breakdown?.structure_clarity ?? 0,
        projectsEducationCertifications:
          breakdown?.projects_education_certifications ?? 0,
        professionalismConsistency:
          breakdown?.professionalism_consistency ?? 0,
        completeness: breakdown?.completeness ?? 0,
      },
      scoreSummary: a.score_summary,
      strengths: a.strengths ?? [],
      improvements: a.improvements ?? [],
      atsScoreBreakdown: {
        structure: ats?.structure ?? 0,
        keywordTerminology: ats?.keyword_terminology ?? 0,
        experienceSkillsParsability:
          ats?.experience_skills_parsability ?? 0,
        formattingConsistency: ats?.formatting_consistency ?? 0,
        contentOrganization: ats?.content_organization ?? 0,
        contactParsability: ats?.contact_parsability ?? 0,
        dateConsistency: ats?.date_consistency ?? 0,
      },
      atsSummary: a.ats_summary,
      atsStrengths: a.ats_strengths ?? [],
      atsImprovements: a.ats_improvements ?? [],
    };
  }

  /**
   * Splits a work summary paragraph into bullet sentences so long summaries
   * stay readable. Splits only on ". " followed by a capital letter, so
   * tokens like "Node.js" or "Express.js" stay intact.
   */
  private splitSummary(summary: string): string[] {
    if (!summary) {
      return [];
    }
    const parts = summary.split(/(?<=[a-z0-9%)])\.\s+(?=[A-Z])/);
    return parts
      .map((part, index) => (index < parts.length - 1 ? `${part.trim()}.` : part.trim()))
      .filter(Boolean);
  }

  /** Formats an ISO timestamp as a short relative label ("2 days ago"). */
  private relativeTime(iso: string): string {
    const time = this.toTime(iso);
    if (!time) {
      return '';
    }
    const minutes = Math.floor((Date.now() - time) / 60000);
    if (minutes < 1) {
      return 'just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return days === 1 ? 'yesterday' : `${days} days ago`;
    }
    const weeks = Math.floor(days / 7);
    if (days < 30) {
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }
    return new Date(time).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  private toTime(iso: string): number {
    const time = new Date(iso).getTime();
    return Number.isNaN(time) ? 0 : time;
  }
}
