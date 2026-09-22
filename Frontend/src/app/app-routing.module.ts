import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { AccessDeniedComponent } from './error/components/access-denied/access-denied.component';
import { NotFoundComponent } from './error/components/not-found/not-found.component';
import { ServerErrorComponent } from './error/components/server-error/server-error.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './pages/layouts/main-layout/main-layout.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AnalyzePageComponent } from './pages/analyze/analyze-page.component';

const appRoutes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'analyze', component: AnalyzePageComponent },
  { path: 'error/access-denied', component: AccessDeniedComponent },
  { path: 'error/not-found', component: NotFoundComponent },
  { path: 'error/server-error', component: ServerErrorComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/dashboard/overview/dashboard-overview.component').then(
            (m) => m.DashboardOverviewComponent,
          ),
      },
      {
        path: 'resume',
        loadComponent: () =>
          import('./pages/dashboard/resume/resume-analysis.component').then(
            (m) => m.ResumeAnalysisComponent,
          ),
      },
      {
        path: 'job-match',
        loadComponent: () =>
          import('./pages/dashboard/job-match/job-match.component').then(
            (m) => m.JobMatchComponent,
          ),
      },
      {
        path: 'resume-qa',
        loadComponent: () =>
          import('./pages/dashboard/resume-qa/resume-qa.component').then(
            (m) => m.ResumeQaComponent,
          ),
      },
      {
        path: 'interview',
        loadComponent: () =>
          import('./pages/dashboard/interview/interview-prep.component').then(
            (m) => m.InterviewPrepComponent,
          ),
      },
      {
        path: 'improve',
        loadComponent: () =>
          import('./pages/dashboard/improve/resume-improve.component').then(
            (m) => m.ResumeImproveComponent,
          ),
      },
      {
        path: 'skill-gaps',
        loadComponent: () =>
          import('./pages/dashboard/skill-gaps/skill-gaps.component').then(
            (m) => m.SkillGapsComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/dashboard/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'home', component: HomeComponent }],
  },
  { path: '**', redirectTo: 'error/not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}