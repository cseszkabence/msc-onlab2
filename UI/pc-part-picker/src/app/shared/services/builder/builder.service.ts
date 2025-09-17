import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Configuration } from '../../../../model/Configuration';
import { SLOT_KEYS, SlotKey } from '../configuration/configuration-slots';


@Injectable({
  providedIn: 'root'
})
export class BuildService {
    private _config$ = new BehaviorSubject<Partial<Configuration>>({});
  readonly config$ = this._config$.asObservable();

  /** current snapshot */
  get currentConfig(): Partial<Configuration> {
    return this._config$.value;
  }

  /** total number of fillable slots */
  readonly totalSlots = SLOT_KEYS.length;

  update(partial: Partial<Configuration>) {
    this._config$.next({ ...this._config$.value, ...partial });
  }

  reset() {
    this._config$.next({});
  }

  remove(key: SlotKey) {
    const next = { ...this._config$.value };
    delete (next as any)[key];
    this._config$.next(next);
  }

  /** Count how many slots are filled (value !== null/undefined) */
  countFilled(keys: readonly SlotKey[] = SLOT_KEYS): number {
    const cfg = this._config$.value;
    let n = 0;
    for (const k of keys) {
      if (cfg[k] != null) n++;
    }
    return n;
  }

  /** Reactive version for templates */
  readonly countFilled$ = this.config$.pipe(map(() => this.countFilled()));

  /** (optional) quick summary */
  getFilledSummary(keys: readonly SlotKey[] = SLOT_KEYS) {
    const count = this.countFilled(keys);
    return { count, total: keys.length, percent: Math.round((count / keys.length) * 100) };
  }
}
