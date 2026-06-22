import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

import { BudgetService } from '../../core/services/budget.service';
import { FilterService } from '../../core/services/filter.service';
import { SectorSummary, YearlyTotal } from '../../core/interfaces/budget.interface';

import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { ChartWrapperComponent } from '../../shared/components/chart-wrapper/chart-wrapper.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface ChartVm {
  barData: ChartData;
  lineData: ChartData;
  pieData: ChartData;
  rateData: ChartData;
}

@Component({
  selector: 'app-chart-view',
  standalone: true,
  templateUrl: './chart-view.component.html',
  styleUrl: './chart-view.component.scss',
  imports: [AsyncPipe, FilterBarComponent, ChartWrapperComponent, LoadingSpinnerComponent, TranslatePipe],
})
export class ChartViewComponent implements OnInit {
  private readonly budgetSvc = inject(BudgetService);
  private readonly filterSvc = inject(FilterService);

  vm$!: Observable<ChartVm>;

  readonly groupedBarOptions: ChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { font: { size: 11 } } } },
    scales: {
      y: { ticks: { font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { ticks: { font: { size: 11 } } },
    },
  };

  readonly lineOptions: ChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 100, ticks: { font: { size: 11 }, callback: v => `${v}%` }, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { ticks: { font: { size: 11 } } },
    },
  };

  readonly pieOptions: ChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10, padding: 8 } } },
  };

  readonly horizontalOptions: ChartOptions = {
    indexAxis: 'y' as const,
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { min: 0, max: 100, ticks: { font: { size: 11 }, callback: v => `${v}%` } },
      y: { ticks: { font: { size: 11 } } },
    },
  };

  ngOnInit(): void {
    this.vm$ = this.filterSvc.filter$.pipe(
      switchMap(filter =>
        combineLatest({
          totals:  this.budgetSvc.getYearlyTotals(),
          sectors: this.budgetSvc.getSectorSummaries(filter),
        }).pipe(map(({ totals, sectors }) => ({
          barData:  this.buildBar(totals),
          lineData: this.buildLine(totals),
          pieData:  this.buildPie(sectors),
          rateData: this.buildRate(sectors),
        })))
      )
    );
  }

  private buildBar(totals: YearlyTotal[]): ChartData {
    return {
      labels: totals.map(t => t.year.toString()),
      datasets: [
        { label: 'Presupuestado', data: totals.map(t => t.budgeted), backgroundColor: '#AFA9EC', borderRadius: 4 },
        { label: 'Ejecutado',     data: totals.map(t => t.executed), backgroundColor: '#534AB7', borderRadius: 4 },
      ],
    };
  }

  private buildLine(totals: YearlyTotal[]): ChartData {
    return {
      labels: totals.map(t => t.year.toString()),
      datasets: [{
        data: totals.map(t => +(t.executionRate.toFixed(1))),
        borderColor: '#534AB7', backgroundColor: 'rgba(83,74,183,0.1)',
        tension: 0.3, fill: true, pointBackgroundColor: '#534AB7',
      }],
    };
  }

  private buildPie(sectors: SectorSummary[]): ChartData {
    return {
      labels: sectors.map(s => s.sector.name),
      datasets: [{ data: sectors.map(s => s.budgeted), backgroundColor: sectors.map(s => s.sector.color), borderWidth: 0 }],
    };
  }

  private buildRate(sectors: SectorSummary[]): ChartData {
    const s = [...sectors].sort((a, b) => b.executionRate - a.executionRate);
    return {
      labels: s.map(x => x.sector.name),
      datasets: [{ data: s.map(x => +x.executionRate.toFixed(1)), backgroundColor: s.map(x => x.sector.color), borderRadius: 4 }],
    };
  }
}
