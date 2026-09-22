import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ImprovementData } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { CollapsibleSectionComponent } from '../../../shared/collapsible-section/collapsible-section.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AppIconComponent,
    PageHeaderComponent,
    CollapsibleSectionComponent,
  ],
  selector: 'app-resume-improve',
  templateUrl: './resume-improve.component.html',
  styleUrls: ['./resume-improve.component.scss'],
})
export class ResumeImproveComponent implements OnInit {
  data: ImprovementData | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getImprovementData().subscribe((d) => (this.data = d));
  }
}