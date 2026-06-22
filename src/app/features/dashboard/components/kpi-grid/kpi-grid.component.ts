import { Component, Input } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { KpiSummary } from '../../../../core/interfaces/budget.interface';
import { KpiCardComponent } from '../../../../shared/components/kpi-card/kpi-card.component';
import { BudgetCurrencyPipe } from '../../../../shared/pipes/budget-currency.pipe';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-kpi-grid',
  standalone: true,
  templateUrl: './kpi-grid.component.html',
  styleUrl: './kpi-grid.component.scss',
  imports: [KpiCardComponent, BudgetCurrencyPipe, TranslatePipe, PercentPipe],
})
export class KpiGridComponent {
  @Input({ required: true }) kpi!: KpiSummary;
  @Input() currency: 'CRC' | 'USD' = 'CRC';
}
