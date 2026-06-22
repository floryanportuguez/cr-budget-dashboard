import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { BudgetService } from '../../core/services/budget.service';
import { FilterService } from '../../core/services/filter.service';
import { KpiSummary, SectorSummary, YearlyTotal } from '../../core/interfaces/budget.interface';

import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

import { KpiGridComponent } from './components/kpi-grid/kpi-grid.component';
import { SectorTableComponent } from './components/sector-table/sector-table.component';
import { DashboardChartsComponent } from './components/charts/charts.component';

interface DashboardVm {
  kpi: KpiSummary;
  sectors: SectorSummary[];
  yearlyTotals: YearlyTotal[];
  currency: 'CRC' | 'USD';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    AsyncPipe,
    FilterBarComponent,
    LoadingSpinnerComponent,
    TranslatePipe,
    KpiGridComponent,
    SectorTableComponent,
    DashboardChartsComponent,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly budgetSvc = inject(BudgetService);
  private readonly filterSvc = inject(FilterService);

  vm$!: Observable<DashboardVm>;

  ngOnInit(): void {
    this.vm$ = this.filterSvc.filter$.pipe(
      switchMap(filter =>
        combineLatest({
          kpi:          this.budgetSvc.getKpiSummary(filter),
          sectors:      this.budgetSvc.getSectorSummaries(filter),
          yearlyTotals: this.budgetSvc.getYearlyTotals(),
        }).pipe(map(data => ({ ...data, currency: filter.currency })))
      )
    );
  }
}
