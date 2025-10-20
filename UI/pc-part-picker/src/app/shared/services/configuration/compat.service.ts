import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// strict-compat.service.ts
@Injectable({ providedIn: 'root' })
export class StrictCompatService {
  private url = 'http://localhost:5147/api/compat/strict';
  constructor(private http: HttpClient) {}
  check(body: { cpuId?: number; motherboardId?: number; memoryId?: number; caseId?: number }) {
    return this.http.post<{ ok: boolean; errors: string[]; facts: any }>(this.url, body, { withCredentials: true });
  }
}
