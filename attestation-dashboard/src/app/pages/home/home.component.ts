import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

interface DashboardCard {
  title: string;
  description: string;
  value: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly cards: DashboardCard[] = [
    { title: 'File Upload & Verification', description: 'Submit attestation files for operational review.', value: 'Upload', route: '/upload' },
    { title: 'Attestation Records', description: 'Review locally captured submission metadata.', value: 'Records', route: '/upload' },
    { title: 'Compliance Tracking', description: 'Monitor annual evidence and control coverage.', value: 'Control', route: '/upload' },
    { title: 'External Applications', description: 'Prepare future internal application redirections.', value: 'Links', route: '/external-pages' },
  ];
}
