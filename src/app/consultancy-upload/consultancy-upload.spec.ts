import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ConsultancyUpload } from './consultancy-upload';
import { ConsultancyService } from '../services/consultancy.service';
import { Consultancy } from '../models/consultancy.model';
import { commonTestProviders } from '../testing/test-providers';

describe('ConsultancyUpload', () => {
  let component: ConsultancyUpload;
  let fixture: ComponentFixture<ConsultancyUpload>;
  let bulkUploadMock: ReturnType<typeof vi.fn>;

  const rows: Consultancy[] = [
    {
      companyName: 'Acme IT',
      website: 'https://acme.be',
      address: 'Brussels',
      phoneNumber: '+32 2 000 0000',
      careerJobsLink: 'https://acme.be/jobs',
    },
  ];

  beforeEach(async () => {
    bulkUploadMock = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ConsultancyUpload],
      providers: [
        ...commonTestProviders,
        {
          provide: ConsultancyService,
          useValue: { bulkUpload: bulkUploadMock },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultancyUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear state when no file is selected', () => {
    const event = { target: { files: [] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFileName()).toBe('');
    expect(component.parsedReady()).toBe(false);
  });

  it('should show error when uploading with no parsed rows', () => {
    component.uploadToBackend();

    expect(component.errorMessage()).toBe('No consultancy records found in the uploaded file.');
    expect(bulkUploadMock).not.toHaveBeenCalled();
  });

  it('should upload parsed rows and show success message', () => {
    bulkUploadMock.mockReturnValue(of(rows));
    component.parsedRows.set(rows);

    component.uploadToBackend();

    expect(bulkUploadMock).toHaveBeenCalledWith(rows);
    expect(component.loading()).toBe(false);
    expect(component.successMessage()).toContain('Process completed!');
    expect(component.parsedRows()).toEqual([]);
    expect(component.parsedReady()).toBe(false);
  });

  it('should show error when bulk upload fails', () => {
    bulkUploadMock.mockReturnValue(throwError(() => new Error('fail')));
    component.parsedRows.set(rows);

    component.uploadToBackend();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toContain('Upload failed');
  });
});
