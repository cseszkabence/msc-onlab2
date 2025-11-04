// src/app/shared/services/config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserConfig {
  id: number;
  name: string;
  userId: number;
  motherboardId?: number;
  processorId?: number;
  videocardId?: number;
  memoryId?: number;
  powersupplyId?: number;
  caseId?: number;
  storageId?: number;
  coolerId?: number;
}


export interface ConfigurationListItem {
  configurationId: number;
  name?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ConfiguratorService {
  private api = 'http://localhost:5147/api/configurations';

  constructor(private http: HttpClient) {}

  list(): Observable<UserConfig[]> {
    return this.http.get<UserConfig[]>(this.api, {
      withCredentials: true
    });
  }

  create(cfg: Partial<UserConfig>): Observable<UserConfig> {
    return this.http.post<UserConfig>(this.api, cfg, {
      withCredentials: true
    });
  }

  update(id: number, cfg: Partial<UserConfig>): Observable<UserConfig> {
    return this.http.put<UserConfig>(`${this.api}/${id}`, cfg, {
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`, {
      withCredentials: true
    });
  }

  listMine(): Observable<ConfigurationListItem[]> {
    // If your API is simply GET /api/configurations for the current user, use that instead.
    return this.http.get<ConfigurationListItem[]>(`${this.api}/mine`, { withCredentials: true });
  }
}
