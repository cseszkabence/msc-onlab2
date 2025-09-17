// src/app/shared/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseURL = 'http://localhost:5147/api/auth';
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    // Optionally, on app init, probe the API to see if we're already authenticated:
    this.checkAuthStatus();
  }

  /** Optional: call a protected endpoint to see if the cookie is valid */
  private checkAuthStatus() {
    this.http
      .get<void>(`${this.baseURL}/status`, { withCredentials: true })
      .subscribe({
        next: () => this.loginStatusSubject.next(true),
        error: () => this.loginStatusSubject.next(false),
      });
  }

  /** Register a new user (unchanged) */
  createUser(formData: any) {
    return this.http.post(`${this.baseURL}/signup`, formData);
  }

  /** Sign in, receive cookie, and mark ourselves logged in */
  signin(formData: { email: string; password: string }) {
    return this.http
      .post<{ message: string }>(
        `${this.baseURL}/signin`,
        formData,
        { withCredentials: true }
      )
      .pipe(
        tap(() => this.loginStatusSubject.next(true))
      );
  }

  /** Log out, clearing the server session & local state */
  logout() {
    return this.http
      .post(`${this.baseURL}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.loginStatusSubject.next(false))
      );
  }

  /** Synchronous read of our current status */
  isLoggedIn(): boolean {
    this.checkAuthStatus();
    return this.loginStatusSubject.value;
  }
}
