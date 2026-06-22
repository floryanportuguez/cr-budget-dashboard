import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BudgetFilter } from '../interfaces/budget.interface';

@Injectable({ providedIn: 'root' })
export class FilterService {
private readonly _filter$ = new BehaviorSubject<BudgetFilter>({
  year: null,
  sectorId: null,
  currency: 'CRC',
});

  readonly filter$ = this._filter$.asObservable();

  get current(): BudgetFilter {
    return this._filter$.getValue();
  }

  setYear(year: number | null): void {
    this._filter$.next({ ...this.current, year });
  }

  setSector(sectorId: string | null): void {
    this._filter$.next({ ...this.current, sectorId });
  }

  setCurrency(currency: 'CRC' | 'USD'): void {
    this._filter$.next({ ...this.current, currency });
  }

  reset(): void {
    this._filter$.next({ year: null, sectorId: null, currency: 'CRC' });
  }
}
