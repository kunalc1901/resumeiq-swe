import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppIconComponent } from '../../../shared/app-icon/app-icon.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { AuthService, SubscriptionService, NotificationService, UploadTask } from '../../../core/services';

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
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent, LoaderComponent],
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit {
  showLoader = true;
  /** Signals keep the UI reactive under Angular's (default) zoneless CD. */
  uploads = signal<UploadTask[]>([]);
  notifications = signal<{ icon: string; text: string; time: string }[]>([
    { icon: 'file-text', text: 'Resume analysis complete', time: '2m ago' },
    { icon: 'target', text: 'New job match is ready', time: '1h ago' },
    { icon: 'sparkles', text: 'New improvement suggestions', time: 'Yesterday' },
  ]);

  trackByUploadId = (_: number, item: UploadTask) => item.id;
  trackByNotif = (_: number, item: { icon: string; text: string; time: string }) =>
    item.text + item.time;
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
      label: 'Account',
      items: [{ label: 'Usage & Plan', route: '/dashboard/usage', icon: 'activity' }],
    },
  ];

  collapsed = false;
  mobileOpen = false;
  profileOpen = false;
  notifOpen = signal(false);

  private user: any = null;
  private firstName = 'John';
  private lastName = 'Doe';
  email = 'john.doe@resumeiq.dev';

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private notificationsService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.subscriptionService.load();
    this.user = this.authService.getUser();
    this.firstName = this.user?.first_name || 'John';
    this.lastName = this.user?.last_name || 'Doe';
    this.email = this.user?.email || 'john.doe@resumeiq.dev';

    // Live upload tasks: auto-open the panel when a new upload starts so the
    // progress is visible. Manual close is respected until the batch finishes.
    let hadTasks = false;
    this.notificationsService.uploads$.subscribe((tasks) => {
      this.uploads.set(tasks);
      if (!hadTasks && tasks.length > 0) {
        hadTasks = true;
        this.notifOpen.set(true);
      }
      if (tasks.length === 0) {
        hadTasks = false;
      }
    });

    // Finished uploads become regular notifications.
    this.notificationsService.completed$.subscribe(({ fileName }) => {
      this.notifications.set([
        { icon: 'file-text', text: `${fileName} uploaded`, time: 'Just now' },
        ...this.notifications(),
      ].slice(0, 5));
    });

    // Failed uploads get a generic notification (details stay in the console).
    this.notificationsService.failed$.subscribe(({ fileName }) => {
      this.notifications.set([
        {
          icon: 'alert-circle',
          text: `Could not upload ${fileName}`,
          time: 'Just now',
        },
        ...this.notifications(),
      ].slice(0, 5));
    });
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
    this.notifOpen.set(false);
  }

  toggleNotifications(): void {
    this.notifOpen.set(!this.notifOpen());
    this.profileOpen = false;
  }

  closeDropdowns(): void {
    this.profileOpen = false;
    this.notifOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}