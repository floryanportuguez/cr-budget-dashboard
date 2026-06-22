import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { SectorSummary, YearlyTotal } from '../../../../core/interfaces/budget.interface';
import { ChartWrapperComponent } from '../../../../shared/components/chart-wrapper/chart-wrapper.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
  imports: [ChartWrapperComponent, TranslatePipe],
})
export class DashboardChartsComponent implements OnChanges {
  @Input({ required: true }) yearlyTotals!: YearlyTotal[];
  @Input({ required: true }) sectors!: SectorSummary[];

  barData!: ChartData;
  pieData!: ChartData;

  readonly barOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { ticks: { font: { size: 11 } } },
    },
  };

  readonly pieOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { font: { size: 11 }, boxWidth: 10, padding: 10 } },
    },
  };

  ngOnChanges(): void {
    this.barData = this.buildBarData();
    this.pieData = this.buildPieData();
  }

  private buildBarData(): ChartData {
    return {
      labels: this.yearlyTotals.map(t => t.year.toString()),
      datasets: [
        { label: 'Presupuestado', data: this.yearlyTotals.map(t => t.budgeted), backgroundColor: '#AFA9EC', borderRadius: 4 },
        { label: 'Ejecutado',     data: this.yearlyTotals.map(t => t.executed), backgroundColor: '#534AB7', borderRadius: 4 },
      ],
    };
  }

  private buildPieData(): ChartData {
    return {
      labels: this.sectors.map(s => s.sector.name),
      datasets: [{ data: this.sectors.map(s => s.budgeted), backgroundColor: this.sectors.map(s => s.sector.color), borderWidth: 0 }],
    };
  }
}
