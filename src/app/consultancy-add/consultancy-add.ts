import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConsultancyService } from '../services/consultancy.service';
import { Consultancy } from '../models/consultancy.model';

@Component({
  selector: 'app-consultancy-add',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './consultancy-add.html',
  styleUrl: './consultancy-add.css',
})
export class ConsultancyAdd {
  private readonly consultancyService = inject(ConsultancyService);
  private readonly cdRef = inject(ChangeDetectorRef);

  consultancy: Consultancy = {
    companyName: '',
    website: '',
    address: '',
    phoneNumber: '',
    careerJobsLink: '',
  };

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  submit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    const trimmed: Consultancy = {
      ...this.consultancy,
      companyName: this.consultancy.companyName.trim(),
      website: this.consultancy.website.trim(),
      address: this.consultancy.address.trim(),
      phoneNumber: this.consultancy.phoneNumber.trim(),
      careerJobsLink: this.consultancy.careerJobsLink.trim(),
    };

    if (!trimmed.companyName) {
      this.errorMessage.set('Company Name is required.');
      return;
    }

    this.loading.set(true);

    this.consultancyService.create(trimmed).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Consultancy added successfully.');
        this.consultancy = {
          companyName: '',
          website: '',
          address: '',
          phoneNumber: '',
          careerJobsLink: '',
        };
        this.cdRef.detectChanges();
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Failed to add consultancy. Please ensure the backend is running on port 8070.');
        this.cdRef.detectChanges();
      },
    });
  }
}
