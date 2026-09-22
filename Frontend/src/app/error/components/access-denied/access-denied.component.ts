import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [],
  selector: 'access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  /**
   * Navigate to home page
   */
  goToHome() {
    this.router.navigate(['/home']);
  }
}