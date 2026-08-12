import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ConsultancyService } from './consultancy.service';
import { Consultancy } from '../models/consultancy.model';

describe('ConsultancyService', () => {
  let service: ConsultancyService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8070/api/v1/consultancies';

  const sample: Consultancy = {
    id: 1,
    companyName: 'Acme IT',
    website: 'https://acme.be',
    address: 'Brussels',
    phoneNumber: '+32 2 000 0000',
    careerJobsLink: 'https://acme.be/jobs',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConsultancyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all consultancies', () => {
    service.getAll().subscribe((data) => {
      expect(data).toEqual([sample]);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([sample]);
  });

  it('should bulk upload consultancies', () => {
    const rows: Consultancy[] = [{ ...sample, id: undefined }];

    service.bulkUpload(rows).subscribe((saved) => {
      expect(saved).toEqual([sample]);
    });

    const req = httpMock.expectOne(`${apiUrl}/bulk`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(rows);
    req.flush([sample]);
  });

  it('should create a single consultancy via bulk endpoint', () => {
    const row: Consultancy = { ...sample, id: undefined };

    service.create(row).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/bulk`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual([row]);
    req.flush([sample]);
  });

  it('should update a consultancy', () => {
    service.update(1, sample).subscribe((updated) => {
      expect(updated).toEqual(sample);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(sample);
    req.flush(sample);
  });

  it('should delete a consultancy', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
