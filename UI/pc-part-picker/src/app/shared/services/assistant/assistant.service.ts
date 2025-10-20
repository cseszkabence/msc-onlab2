// assistant.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ReviewByNamesRequest {
  cpu?: string | null; gpu?: string | null; motherboard?: string | null; memory?: string | null;
  storage?: string | null; powersupply?: string | null; pccase?: string | null; cpucooler?: string | null;
  targetUse?: string | null; budgetTier?: string | null;
}

export interface UpgradeTip { slot: string; suggestion: string; reason: string; }
export interface AiReviewResponse {
  verdict: string;
  recommendedUseCases: string[];
  strengths: string[];
  weaknesses: string[];
  upgradePriorities: UpgradeTip[];
  summary: string;
}

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private base = 'http://localhost:5147/api/assistant';

  constructor(private http: HttpClient) {}

  reviewByNames(body: ReviewByNamesRequest) {
    // IMPORTANT: responseType:'text'
    return this.http.post(`${this.base}/review`, body, {
      withCredentials: true,
      responseType: 'text'
    });
  }
}
