import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Configuration } from '../../../../model/Configuration';

@Injectable({
  providedIn: 'root'
})
export class BuildService {
  private _config$ = new BehaviorSubject<Configuration>({});
  config$ = this._config$.asObservable();
  get currentConfig() { return this._config$.value; }

  update(partial: Partial<Configuration>) {
    this._config$.next({ ...this._config$.value, ...partial });
  }

  reset() {
    this._config$.next({});
  }
}
