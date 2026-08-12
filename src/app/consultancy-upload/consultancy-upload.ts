import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { ConsultancyService } from '../services/consultancy.service';
import { Consultancy } from '../models/consultancy.model';

@Component({
  selector: 'app-consultancy-upload',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './consultancy-upload.html',
  styleUrl: './consultancy-upload.css'
})
export class ConsultancyUpload {
  private readonly consultancyService = inject(ConsultancyService);
  private readonly cdRef = inject(ChangeDetectorRef);

  selectedFileName = signal('');
  parsedRows = signal<Consultancy[]>([]);
  parsedSheetCount = signal(0);
  parsedReady = signal(false);
  reading = signal(false);
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.successMessage.set('');
    this.errorMessage.set('');
    this.parsedRows.set([]);
    this.parsedSheetCount.set(0);
    this.parsedReady.set(false);
    this.reading.set(false);

    if (!file) {
      this.selectedFileName.set('');
      return;
    }

    this.selectedFileName.set(file.name);
    this.reading.set(true);
    this.cdRef.detectChanges();

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        this.parsedSheetCount.set(workbook.SheetNames.length);
        const allRows: Consultancy[] = [];

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { defval: '' });

          const mappedRows = rows
            .map((row) => this.mapExcelRow(row))
            .filter((row) => row.companyName.trim().length > 0);

          allRows.push(...mappedRows);
        }

        this.parsedRows.set(allRows);
        this.parsedReady.set(true);
      } catch {
        this.errorMessage.set('Unable to read the Excel file. Please upload a valid .xlsx file.');
        this.parsedSheetCount.set(0);
        this.parsedReady.set(true);
      }
      this.reading.set(false);
      this.cdRef.detectChanges();
    };

    reader.readAsArrayBuffer(file);
  }

  uploadToBackend(): void {
    if (!this.parsedRows().length) {
      this.errorMessage.set('No consultancy records found in the uploaded file.');
      return;
    }

    this.loading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const rowCount = this.parsedRows().length;

    this.consultancyService.bulkUpload(this.parsedRows()).subscribe({
      next: (saved) => {
        const savedCount = Array.isArray(saved) ? saved.length : rowCount;
        this.loading.set(false);
        this.successMessage.set(`Process completed! ${savedCount} consultancy record(s) uploaded successfully.`);
        this.parsedRows.set([]);
        this.parsedSheetCount.set(0);
        this.parsedReady.set(false);
        this.selectedFileName.set('');
        this.cdRef.detectChanges();
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Upload failed. Please ensure the backend is running on port 8070.');
        this.cdRef.detectChanges();
      },
    });
  }

  private mapExcelRow(row: Record<string, string>): Consultancy {
    return {
      companyName: row['Company Name'] ?? '',
      website: row['Website'] ?? '',
      address: row['Address'] ?? '',
      phoneNumber: row['Phone Number'] ?? '',
      careerJobsLink: row['Career / Jobs Link'] ?? ''
    };
  }
}
