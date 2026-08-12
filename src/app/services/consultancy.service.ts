import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultancy } from '../models/consultancy.model';

@Injectable({ providedIn: 'root' })
export class ConsultancyService {
  private readonly apiUrl = 'http://localhost:8070/api/v1/consultancies';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Consultancy[]> {
    return this.http.get<Consultancy[]>(this.apiUrl);
  }

  bulkUpload(consultancies: Consultancy[]): Observable<Consultancy[]> {
    return this.http.post<Consultancy[]>(`${this.apiUrl}/bulk`, consultancies);
  }

  create(consultancy: Consultancy): Observable<any> {
    return this.http.post(`${this.apiUrl}/bulk`, [consultancy]);
  }

  update(id: number, consultancy: Consultancy): Observable<Consultancy> {
    return this.http.put<Consultancy>(`${this.apiUrl}/${id}`, consultancy);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
