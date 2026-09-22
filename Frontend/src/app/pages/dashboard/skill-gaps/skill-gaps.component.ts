import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SkillGapData } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AppIconComponent,
    PageHeaderComponent,
    ProgressBarComponent,
  ],
  selector: 'app-skill-gaps',
  templateUrl: './skill-gaps.component.html',
  styleUrls: ['./skill-gaps.component.scss'],
})
export class SkillGapsComponent implements OnInit {
  data: SkillGapData | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSkillGaps().subscribe((d) => (this.data = d));
  }
}