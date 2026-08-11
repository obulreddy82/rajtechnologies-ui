import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { SignInRequest, UserProfile } from '../models/user.model';

const STORAGE_KEY = 'rt_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = 'http://localhost:8070/api/v1';
  private readonly currentUserSignal = signal<UserProfile | null>(this.readStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor(private http: HttpClient) {}

  signIn(credentials: SignInRequest): Observable<UserProfile | null> {
    return this.http
      .post<UserProfile | null>(`${this.apiUrl}/signin`, credentials)
      .pipe(
        map((user) => user ?? null),
        tap((user) => {
          if (user) {
            this.setUser(user);
          }
        })
      );
  }

  signOut(): void {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private setUser(user: UserProfile): void {
    const { password, ...safeUser } = user;
    this.currentUserSignal.set(safeUser as UserProfile);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  }

  private readStoredUser(): UserProfile | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  }
}
