import { Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';

@Component({
  standalone: true,
  imports: [RevealDirective],
  selector: 'app-ai-insights',
  templateUrl: './ai-insights.component.html',
  styleUrls: ['./ai-insights.component.scss'],
})
export class AiInsightsComponent {}