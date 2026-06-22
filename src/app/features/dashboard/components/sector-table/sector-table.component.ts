import { Component, Input } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { SectorSummary } from '../../../../core/interfaces/budget.interface';
import { BudgetCurrencyPipe } from '../../../../shared/pipes/budget-currency.pipe';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-sector-table',
  standalone: true,
  templateUrl: './sector-table.component.html',
  styleUrl: './sector-table.component.scss',
  imports: [BudgetCurrencyPipe, TranslatePipe, PercentPipe],
})
export class SectorTableComponent {
  @Input({ required: true }) sectors!: SectorSummary[];
  @Input() currency: 'CRC' | 'USD' = 'CRC';
}
