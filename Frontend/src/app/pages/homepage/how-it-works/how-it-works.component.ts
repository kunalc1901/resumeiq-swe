import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';

interface Step {
  number: string;
  title: string;
  description: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, RevealDirective],
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss'],
})
export class HowItWorksComponent {
  steps: Step[] = [
    {
      number: '01',
      title: 'Upload',
      description: 'Upload your resume as a PDF.',
    },
    {
      number: '02',
      title: 'Analyze',
      description: 'ResumeIQ processes your experience, skills and projects using AI.',
    },
    {
      number: '03',
      title: 'Improve',
      description: 'Get actionable insights and personalized recommendations.',
    },
  ];
}