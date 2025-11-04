import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AccountInfo {
  id: string;
  email: string;
  fullName?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly base = 'http://localhost:5147/api/account';
  constructor(private http: HttpClient) { }
  getMe(): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${this.base}/me`, { withCredentials: true });
  }
}
