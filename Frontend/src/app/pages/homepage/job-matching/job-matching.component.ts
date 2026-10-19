import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [RevealDirective],
  selector: 'app-job-matching',
  templateUrl: './job-matching.component.html',
  styleUrls: ['./job-matching.component.scss'],
})
export class JobMatchingComponent {}