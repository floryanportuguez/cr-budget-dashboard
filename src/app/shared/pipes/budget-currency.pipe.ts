import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'budgetCurrency', standalone: true })
export class BudgetCurrencyPipe implements PipeTransform {
  transform(value: number, currency: 'CRC' | 'USD' = 'CRC'): string {
    if (value == null) return '-';
    const symbol  = currency === 'CRC' ? '₡' : '$';
    const billions = value / 1_000_000_000;
    const millions = value / 1_000_000;

    if (Math.abs(billions) >= 1) return `${symbol}${billions.toFixed(1)}B`;
    if (Math.abs(millions) >= 1) return `${symbol}${millions.toFixed(0)}M`;
    return `${symbol}${value.toLocaleString('es-CR')}`;
  }
}
