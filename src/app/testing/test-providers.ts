import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

/** Common TestBed providers for components using RouterLink or HttpClient. */
export const commonTestProviders = [
  provideRouter([]),
  provideHttpClient(),
  provideHttpClientTesting(),
];
