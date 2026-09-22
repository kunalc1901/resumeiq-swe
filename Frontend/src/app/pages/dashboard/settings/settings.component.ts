import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent, PageHeaderComponent],
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  prefs = {
    darkMode: true,
    emailNotifications: true,
    interviewReminders: true,
    responseStyle: 'Concise',
    analysisDetail: 'Detailed',
  };

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}