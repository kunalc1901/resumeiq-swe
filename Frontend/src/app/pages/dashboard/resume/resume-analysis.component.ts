import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { FEATURE_IDS } from '../../../core/constants/feature-ids';
import { ResumeAnalysis } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ScoreRingComponent } from '../../../shared/score-ring/score-ring.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { CollapsibleSectionComponent } from '../../../shared/collapsible-section/collapsible-section.component';
import { UpgradeModalComponent } from '../../../shared/upgrade-modal/upgrade-modal.component';
import { TruncateTitleDirective } from '../../../shared/truncate-title/truncate-title.directive';

interface ResumeCard {
  id: string;
  fileName: string;
  uploadedAt: string;
  overallScore: number | null;
  atsScore: number | null;
  analyzed: boolean;
  selected: boolean;
}

interface BreakdownRow {
  label: string;
  value: number;
  max: number;
}

const MOCK_RESUME_NAMES = [
  'Software_Engineer_Resume.pdf',
  'John_Doe_Resume_2024.pdf',
  'Software_Engineer_Resume_Final.pdf',
];

const MOCK_DATES = ['2 days ago', '2 weeks ago', 'Yesterday'];

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AppIconComponent,
    PageHeaderComponent,
    ScoreRingComponent,
    ProgressBarComponent,
    CollapsibleSectionComponent,
    UpgradeModalComponent,
    TruncateTitleDirective,
  ],
  selector: 'app-resume-analysis',
  templateUrl: './resume-analysis.component.html',
  styleUrls: ['./resume-analysis.component.scss'],
})
export class ResumeAnalysisComponent implements OnInit {
  analysis: ResumeAnalysis | null = null;
  resumes: ResumeCard[] = [];
  analyzing = false;
  seeded = false;

  slotModalOpen = false;
  analysisModalOpen = false;

  get overallBreakdown(): BreakdownRow[] {
    const b = this.analysis?.scoreBreakdown;
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
    const b = this.analysis?.atsScoreBreakdown;
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
    public subscription: SubscriptionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription.load();
    this.subscription.state$.subscribe((state) => {
      if (!state.loading && !this.seeded) {
        this.seeded = true;
        this.buildResumes();
        const analyzed = this.resumes.find((r) => r.analyzed);
        if (analyzed) {
          this.loadAnalysis(analyzed);
        }
      }
    });
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
    const selected = this.resumes.find((r) => r.selected);
    return selected?.fileName || 'Resume';
  }

  /** Upload flow. Consumes a resume slot (mock) or shows the upgrade modal. */
  onUpload(): void {
    if (!this.hasSlotsRemaining) {
      this.slotModalOpen = true;
      return;
    }
    const idx = this.resumes.length;
    this.resumes.push({
      id: `resume-${Date.now()}`,
      fileName: `My_Resume_${idx + 1}.pdf`,
      uploadedAt: 'Just now',
      overallScore: null,
      atsScore: null,
      analyzed: false,
      selected: false,
    });
    this.subscription.consume('resumeSlots');
  }

  /** Selecting a resume never consumes AI usage. */
  selectResume(resume: ResumeCard): void {
    this.resumes.forEach((r) => (r.selected = r.id === resume.id));
    if (resume.analyzed) {
      this.loadAnalysis(resume);
    }
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
      this.analysis = a;
      this.analyzing = false;
      resume.analyzed = true;
      this.resumes.forEach((r) => (r.selected = r.id === resume.id));
      this.subscription.consume('resumeAnalyses');
    });
  }

  /** Deleting a resume frees a storage slot but never restores AI usage. */
  deleteResume(resume: ResumeCard): void {
    this.resumes = this.resumes.filter((r) => r.id !== resume.id);
    this.subscription.restore('resumeSlots');
    if (resume.selected) {
      this.analysis = null;
      const next = this.resumes[0];
      if (next) {
        this.selectResume(next);
      }
    }
  }

  goUpgrade(): void {
    this.router.navigate(['/dashboard/upgrade']);
  }

  private loadAnalysis(resume: ResumeCard): void {
    this.dashboardService.getResumeAnalysis().subscribe((a) => {
      this.analysis = a;
      this.analyzing = false;
    });
  }

  private buildResumes(): void {
    const used = this.subscription.usageOf('resumeSlots').used;
    this.resumes = [];
    for (let i = 0; i < used; i++) {
      const analyzed = i === 0;
      this.resumes.push({
        id: `resume-${i}`,
        fileName: MOCK_RESUME_NAMES[i % MOCK_RESUME_NAMES.length],
        uploadedAt: MOCK_DATES[i % MOCK_DATES.length],
        overallScore: analyzed ? 82 + i : null,
        atsScore: analyzed ? 78 + i : null,
        analyzed,
        selected: analyzed,
      });
    }
  }
}