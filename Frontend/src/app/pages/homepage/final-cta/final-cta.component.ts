import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../reveal.directive';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  selector: 'app-final-cta',
  templateUrl: './final-cta.component.html',
  styleUrls: ['./final-cta.component.scss'],
})
export class FinalCtaComponent {
  techBadges: string[] = [
    'AI',
    'RAG',
    'Semantic Search',
    'Vector Search',
    'Personalized Analysis',
  ];
}