import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';

interface Feature {
  title: string;
  description: string;
  icon: 'document' | 'target' | 'message' | 'sparkles';
}

@Component({
  standalone: true,
  imports: [CommonModule, RevealDirective],
  selector: 'app-feature-section',
  templateUrl: './feature-section.component.html',
  styleUrls: ['./feature-section.component.scss'],
})
export class FeatureSectionComponent {
  features: Feature[] = [
    {
      title: 'Analyze Your Resume',
      description:
        'Get an AI-powered breakdown of your skills, experience, projects, strengths, weaknesses and improvement areas.',
      icon: 'document',
    },
    {
      title: 'Match With Any Job',
      description:
        'Compare your resume with a job description and discover relevant skills, missing keywords and potential gaps.',
      icon: 'target',
    },
    {
      title: 'Prepare for Interviews',
      description:
        'Generate personalized interview questions based on your resume, projects, experience and target role.',
      icon: 'message',
    },
    {
      title: 'Improve With AI',
      description:
        'Get practical suggestions to make your resume clearer, stronger and more relevant to the roles you want.',
      icon: 'sparkles',
    },
  ];
}