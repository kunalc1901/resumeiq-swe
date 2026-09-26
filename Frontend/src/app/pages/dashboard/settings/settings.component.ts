import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, SubscriptionService } from '../../../core/services';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { PremiumBadgeComponent } from '../../../shared/premium-badge/premium-badge.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AppIconComponent,
    PageHeaderComponent,
    PremiumBadgeComponent,
  ],
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

  constructor(
    private authService: AuthService,
    public subscription: SubscriptionService,
  ) {}

  get isPremium(): boolean {
    return this.subscription.isPremium();
  }

  logout(): void {
    this.authService.logout();
  }
}