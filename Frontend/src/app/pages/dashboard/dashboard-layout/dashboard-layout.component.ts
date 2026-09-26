import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { SubscriptionStatusComponent } from '../../../shared/subscription-status/subscription-status.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { AuthService, SubscriptionService } from '../../../core/services';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent, SubscriptionStatusComponent, LoaderComponent],
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit {
  showLoader = true;
  navGroups: NavGroup[] = [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', route: '/dashboard/overview', icon: 'dashboard' },
        { label: 'My Resume', route: '/dashboard/resume', icon: 'file-text' },
        { label: 'Job Match', route: '/dashboard/job-match', icon: 'target' },
        { label: 'Resume Q&A', route: '/dashboard/resume-qa', icon: 'message-square' },
        { label: 'Interview Prep', route: '/dashboard/interview', icon: 'mic' },
      ],
    },
    {
      label: 'Improve',
      items: [
        { label: 'Resume Improvement', route: '/dashboard/improve', icon: 'sparkles' },
        { label: 'Skill Gaps', route: '/dashboard/skill-gaps', icon: 'trending-up' },
      ],
    },
    {
      label: 'Account',
      items: [{ label: 'Usage & Plan', route: '/dashboard/usage', icon: 'activity' }],
    },
  ];

  notifications = [
    { icon: 'file-text', text: 'Resume analysis complete', time: '2m ago' },
    { icon: 'target', text: 'New job match is ready', time: '1h ago' },
    { icon: 'sparkles', text: 'New improvement suggestions', time: 'Yesterday' },
  ];

  collapsed = false;
  mobileOpen = false;
  profileOpen = false;
  notifOpen = false;

  private user: any = null;
  private firstName = 'John';
  private lastName = 'Doe';
  email = 'john.doe@resumeiq.dev';

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    this.subscriptionService.load();
    this.user = this.authService.getUser();
    this.firstName = this.user?.first_name || 'John';
    this.lastName = this.user?.last_name || 'Doe';
    this.email = this.user?.email || 'john.doe@resumeiq.dev';
  }

  onLoaderComplete(): void {
    this.showLoader = false;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials(): string {
    const f = (this.firstName || '')[0] || 'J';
    const l = (this.lastName || '')[0] || 'D';
    return (f + l).toUpperCase();
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  openMobileMenu(): void {
    this.mobileOpen = true;
  }

  closeMobileMenu(): void {
    this.mobileOpen = false;
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.notifOpen = false;
  }

  toggleNotifications(): void {
    this.notifOpen = !this.notifOpen;
    this.profileOpen = false;
  }

  closeDropdowns(): void {
    this.profileOpen = false;
    this.notifOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}