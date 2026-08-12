import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ConsultancyList } from './consultancy-list';
import { ConsultancyService } from '../services/consultancy.service';
import { Consultancy } from '../models/consultancy.model';
import { commonTestProviders } from '../testing/test-providers';

describe('ConsultancyList', () => {
  let component: ConsultancyList;
  let fixture: ComponentFixture<ConsultancyList>;
  let getAllMock: ReturnType<typeof vi.fn>;
  let updateMock: ReturnType<typeof vi.fn>;
  let deleteMock: ReturnType<typeof vi.fn>;

  const rows: Consultancy[] = [
    {
      id: 1,
      companyName: 'Beta Corp',
      website: 'https://beta.be',
      address: 'Antwerp',
      phoneNumber: '+32 3 000 0000',
      careerJobsLink: 'https://beta.be/jobs',
    },
    {
      id: 2,
      companyName: 'Acme IT',
      website: 'https://acme.be',
      address: 'Brussels',
      phoneNumber: '+32 2 000 0000',
      careerJobsLink: 'https://acme.be/jobs',
    },
  ];

  beforeEach(async () => {
    getAllMock = vi.fn().mockReturnValue(of(rows));
    updateMock = vi.fn();
    deleteMock = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ConsultancyList],
      providers: [
        ...commonTestProviders,
        {
          provide: ConsultancyService,
          useValue: {
            getAll: getAllMock,
            update: updateMock,
            delete: deleteMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultancyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and load consultancies', () => {
    expect(component).toBeTruthy();
    expect(component.consultancies()).toEqual(rows);
    expect(component.loading()).toBe(false);
  });

  it('should filter consultancies by search term', () => {
    component.onSearchChange('acme');

    expect(component.filteredConsultancies().length).toBe(1);
    expect(component.filteredConsultancies()[0].companyName).toBe('Acme IT');
  });

  it('should sort consultancies ascending by company name by default', () => {
    expect(component.filteredConsultancies()[0].companyName).toBe('Acme IT');
    expect(component.sortLabel('companyName')).toBe('↑');
  });

  it('should toggle sort direction on same column', () => {
    component.toggleSort('companyName');

    expect(component.sortDirection()).toBe('desc');
    expect(component.sortLabel('companyName')).toBe('↓');
    expect(component.filteredConsultancies()[0].companyName).toBe('Beta Corp');
  });

  it('should start and cancel inline edit', () => {
    component.startEdit(rows[0]);

    expect(component.editingId()).toBe(1);
    expect(component.editDraft()?.companyName).toBe('Beta Corp');

    component.cancelEdit();

    expect(component.editingId()).toBeNull();
    expect(component.editDraft()).toBeNull();
  });

  it('should update consultancy on save', () => {
    const updated = { ...rows[0], companyName: 'Beta Updated' };
    updateMock.mockReturnValue(of(updated));

    component.startEdit(rows[0]);
    component.updateDraftField('companyName', 'Beta Updated');
    component.updateConsultancy();

    expect(updateMock).toHaveBeenCalledWith(1, expect.objectContaining({
      companyName: 'Beta Updated',
    }));
    expect(component.successMessage()).toBe('Consultancy updated successfully.');
    expect(component.editingId()).toBeNull();
  });

  it('should delete consultancy when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    deleteMock.mockReturnValue(of(void 0));

    component.deleteConsultancy(rows[0]);

    expect(deleteMock).toHaveBeenCalledWith(1);
    expect(component.consultancies().length).toBe(1);
    expect(component.successMessage()).toBe('Consultancy deleted successfully.');
  });

  it('should not delete when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteConsultancy(rows[0]);

    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('should set error when load fails', () => {
    getAllMock.mockReturnValue(throwError(() => new Error('fail')));

    component.loadConsultancies();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toContain('Failed to load consultancies');
  });
});
