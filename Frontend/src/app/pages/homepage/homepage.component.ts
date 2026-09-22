import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { FeatureSectionComponent } from './feature-section/feature-section.component';
import { JobMatchingComponent } from './job-matching/job-matching.component';
import { AiInsightsComponent } from './ai-insights/ai-insights.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { InterviewPrepComponent } from './interview-prep/interview-prep.component';
import { FinalCtaComponent } from './final-cta/final-cta.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FeatureSectionComponent,
    JobMatchingComponent,
    AiInsightsComponent,
    HowItWorksComponent,
    InterviewPrepComponent,
    FinalCtaComponent,
    FooterComponent,
  ],
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {}