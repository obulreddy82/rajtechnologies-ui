import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConsultancyService } from '../services/consultancy.service';
import {
  Consultancy,
  ConsultancySortField,
  SortDirection
} from '../models/consultancy.model';

@Component({
  selector: 'app-consultancy-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './consultancy-list.html',
  styleUrl: './consultancy-list.css'
})
export class ConsultancyList implements OnInit {
  private readonly consultancyService = inject(ConsultancyService);

  consultancies = signal<Consultancy[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  searchTerm = signal('');
  sortField = signal<ConsultancySortField>('companyName');
  sortDirection = signal<SortDirection>('asc');

  editingId = signal<number | null>(null);
  editDraft = signal<Consultancy | null>(null);

  readonly filteredConsultancies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const field = this.sortField();
    const direction = this.sortDirection();

    let rows = [...this.consultancies()];

    if (term) {
      rows = rows.filter((item) =>
        item.companyName.toLowerCase().includes(term) ||
        item.website.toLowerCase().includes(term) ||
        item.address.toLowerCase().includes(term) ||
        item.phoneNumber.toLowerCase().includes(term) ||
        item.careerJobsLink.toLowerCase().includes(term)
      );
    }

    rows.sort((a, b) => {
      const left = (a[field] ?? '').toString().toLowerCase();
      const right = (b[field] ?? '').toString().toLowerCase();
      const result = left.localeCompare(right);
      return direction === 'asc' ? result : -result;
    });

    return rows;
  });

  ngOnInit(): void {
    this.loadConsultancies();
  }

  loadConsultancies(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.consultancyService.getAll().subscribe({
      next: (data) => {
        this.consultancies.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Failed to load consultancies. Please ensure the backend is running on port 8070.');
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  toggleSort(field: ConsultancySortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortField.set(field);
    this.sortDirection.set('asc');
  }

  sortLabel(field: ConsultancySortField): string {
    if (this.sortField() !== field) {
      return '↕';
    }
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  startEdit(item: Consultancy): void {
    if (!item.id) {
      return;
    }

    this.editingId.set(item.id);
    this.editDraft.set({ ...item });
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editDraft.set(null);
  }

  updateConsultancy(): void {
    const draft = this.editDraft();
    const id = this.editingId();

    if (!draft || !id) {
      return;
    }

    this.consultancyService.update(id, draft).subscribe({
      next: (updated) => {
        this.consultancies.update((rows) =>
          rows.map((row) => (row.id === id ? updated : row))
        );
        this.successMessage.set('Consultancy updated successfully.');
        this.cancelEdit();
      },
      error: () => {
        this.errorMessage.set('Failed to update consultancy.');
      }
    });
  }

  deleteConsultancy(item: Consultancy): void {
    if (!item.id) {
      return;
    }

    const confirmed = confirm(`Delete "${item.companyName}"?`);
    if (!confirmed) {
      return;
    }

    this.consultancyService.delete(item.id).subscribe({
      next: () => {
        this.consultancies.update((rows) => rows.filter((row) => row.id !== item.id));
        this.successMessage.set('Consultancy deleted successfully.');

        if (this.editingId() === item.id) {
          this.cancelEdit();
        }
      },
      error: () => {
        this.errorMessage.set('Failed to delete consultancy.');
      }
    });
  }

  updateDraftField(field: keyof Consultancy, value: string): void {
    const draft = this.editDraft();
    if (!draft) {
      return;
    }

    this.editDraft.set({ ...draft, [field]: value });
  }
}
