import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import {
  BudgetData, BudgetFilter, BudgetItem,
  KpiSummary, SectorSummary, YearlyTotal,
  ExecutionStatus, EXECUTION_THRESHOLDS, CRC_TO_USD,
} from '../interfaces/budget.interface';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly http = inject(HttpClient);

  private readonly data$ = this.http
    .get<BudgetData>('assets/data/budget.json')
    .pipe(map(this.enrich), shareReplay(1));

  getData(): Observable<BudgetData> {
    return this.data$;
  }

  getFilteredItems(filter: BudgetFilter): Observable<BudgetItem[]> {
    return this.data$.pipe(
      map(({ items }) => items
        .filter(i => (!filter.year     || i.year     === filter.year)
                  && (!filter.sectorId || i.sectorId === filter.sectorId))
        .map(i => filter.currency === 'USD' ? this.toUsd(i) : i)
      )
    );
  }

  getKpiSummary(filter: BudgetFilter): Observable<KpiSummary> {
    return this.getFilteredItems(filter).pipe(
      map(items => {
        const totalBudgeted = items.reduce((s, i) => s + i.budgeted, 0);
        const totalExecuted = items.reduce((s, i) => s + i.executed, 0);
        return {
          totalBudgeted,
          totalExecuted,
          executionRate:  totalBudgeted > 0 ? (totalExecuted / totalBudgeted) * 100 : 0,
          activeSectors:  new Set(items.map(i => i.sectorId)).size,
          unexecuted:     totalBudgeted - totalExecuted,
        };
      })
    );
  }

  getSectorSummaries(filter: BudgetFilter): Observable<SectorSummary[]> {
    return this.data$.pipe(
      map(({ items, sectors }) => {
        const filtered = items.filter(i =>
          (!filter.year     || i.year     === filter.year) &&
          (!filter.sectorId || i.sectorId === filter.sectorId)
        );
        const convert = (v: number) => filter.currency === 'USD' ? v * CRC_TO_USD : v;

        return sectors.map(sector => {
          const si = filtered.filter(i => i.sectorId === sector.id);
          const budgeted = si.reduce((s, i) => s + i.budgeted, 0);
          const executed = si.reduce((s, i) => s + i.executed, 0);
          const rate     = budgeted > 0 ? (executed / budgeted) * 100 : 0;
          return {
            sector,
            budgeted: convert(budgeted),
            executed: convert(executed),
            executionRate: rate,
            status: this.statusFor(rate),
          };
        })
        .filter(s => s.budgeted > 0)
        .sort((a, b) => b.executionRate - a.executionRate);
      })
    );
  }

  getYearlyTotals(): Observable<YearlyTotal[]> {
    return this.data$.pipe(
      map(({ years, items }) => years.map(year => {
        const yi = items.filter(i => i.year === year);
        const budgeted = yi.reduce((s, i) => s + i.budgeted, 0);
        const executed = yi.reduce((s, i) => s + i.executed, 0);
        return { year, budgeted, executed, executionRate: budgeted > 0 ? (executed / budgeted) * 100 : 0 };
      }))
    );
  }

  private enrich(data: BudgetData): BudgetData {
    return {
      ...data,
      items: data.items.map(item => {
        const rate = item.budgeted > 0 ? (item.executed / item.budgeted) * 100 : 0;
        return {
          ...item,
          executionRate:   rate,
          executionStatus: rate >= EXECUTION_THRESHOLDS.optimal ? 'optimal'
                         : rate >= EXECUTION_THRESHOLDS.atRisk  ? 'at-risk'
                         : 'low',
        };
      }),
    };
  }

  private statusFor(rate: number): ExecutionStatus {
    return rate >= EXECUTION_THRESHOLDS.optimal ? 'optimal'
         : rate >= EXECUTION_THRESHOLDS.atRisk  ? 'at-risk'
         : 'low';
  }

  private toUsd(item: BudgetItem): BudgetItem {
    return { ...item, budgeted: item.budgeted * CRC_TO_USD, executed: item.executed * CRC_TO_USD };
  }
}
