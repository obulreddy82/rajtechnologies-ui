import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ConsultancyAdd } from './consultancy-add';
import { ConsultancyService } from '../services/consultancy.service';
import { commonTestProviders } from '../testing/test-providers';

describe('ConsultancyAdd', () => {
  let component: ConsultancyAdd;
  let fixture: ComponentFixture<ConsultancyAdd>;
  let createMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    createMock = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ConsultancyAdd],
      providers: [
        ...commonTestProviders,
        {
          provide: ConsultancyService,
          useValue: { create: createMock },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultancyAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when company name is empty', () => {
    component.consultancy.companyName = '   ';
    component.submit();

    expect(component.errorMessage()).toBe('Company Name is required.');
    expect(createMock).not.toHaveBeenCalled();
  });

  it('should submit trimmed consultancy and reset form on success', () => {
    createMock.mockReturnValue(of({}));

    component.consultancy = {
      companyName: '  Acme IT  ',
      website: 'https://acme.be',
      address: 'Brussels',
      phoneNumber: '+32 2 000 0000',
      careerJobsLink: 'https://acme.be/jobs',
    };

    component.submit();

    expect(createMock).toHaveBeenCalledWith({
      companyName: 'Acme IT',
      website: 'https://acme.be',
      address: 'Brussels',
      phoneNumber: '+32 2 000 0000',
      careerJobsLink: 'https://acme.be/jobs',
    });
    expect(component.loading()).toBe(false);
    expect(component.successMessage()).toBe('Consultancy added successfully.');
    expect(component.consultancy.companyName).toBe('');
  });

  it('should show error message when create fails', () => {
    createMock.mockReturnValue(throwError(() => new Error('fail')));

    component.consultancy.companyName = 'Acme IT';
    component.submit();

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toContain('Failed to add consultancy');
  });
});
