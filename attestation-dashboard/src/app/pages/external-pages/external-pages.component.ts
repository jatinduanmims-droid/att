import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-external-pages',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './external-pages.component.html',
  styleUrl: './external-pages.component.scss',
})
export class ExternalPagesComponent {
  readonly pages = ['Operations Portal', 'Risk Controls', 'Evidence Repository', 'Client Reference'];

  constructor(private readonly router: Router) {}

  openPlaceholder(): void {
    // ADD CUSTOM PAGE ROUTE HERE
    // Example:
    // this.router.navigate(['/your-page'])
    this.router.navigate(['/external-pages']);
  }
}
