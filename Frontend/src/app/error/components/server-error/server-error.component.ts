import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [],
  selector: 'server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss'],
})
export class ServerErrorComponent {
  constructor(private router: Router) {}

  /**
   * Navigate to home page
   */
  goToHome() {
    this.router.navigate(['/home']);
  }
}