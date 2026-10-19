import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [CommonModule, RevealDirective],
  selector: 'app-interview-prep',
  templateUrl: './interview-prep.component.html',
  styleUrls: ['./interview-prep.component.scss'],
})
export class InterviewPrepComponent {
  questionTags: string[] = [
    'Technical Questions',
    'Project Questions',
    'Experience-Based Questions',
    'Follow-up Questions',
  ];
}