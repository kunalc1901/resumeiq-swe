import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ProfileData } from '../../../core/models/dashboard.model';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent, PageHeaderComponent],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form: ProfileData = {
    firstName: '',
    lastName: '',
    email: '',
    targetRole: '',
    experienceLevel: '',
    technologies: [],
  };
  saved = false;
  avatar = '';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.dashboardService.getProfile().subscribe((p) => {
      this.form = { ...p };
      this.applyAuthUser();
    });
  }

  private applyAuthUser(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.avatar = this.initials;
      return;
    }
    this.form.firstName = user.first_name || this.form.firstName;
    this.form.lastName = user.last_name || this.form.lastName;
    this.form.email = user.email || this.form.email;
    this.avatar = this.initials;
  }

  get initials(): string {
    const f = (this.form.firstName || 'J')[0] || 'J';
    const l = (this.form.lastName || 'D')[0] || 'D';
    return (f + l).toUpperCase();
  }

  save(): void {
    this.saved = true;
    setTimeout(() => (this.saved = false), 3000);
  }
}