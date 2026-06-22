import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, PercentPipe } from '@angular/common';
import { Observable, switchMap } from 'rxjs';

import { BudgetService } from '../../core/services/budget.service';
import { FilterService } from '../../core/services/filter.service';
import { BudgetItem } from '../../core/interfaces/budget.interface';

import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { BudgetCurrencyPipe } from '../../shared/pipes/budget-currency.pipe';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

type SortField = 'year' | 'sectorId' | 'budgeted' | 'executed' | 'executionRate';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
  imports: [AsyncPipe, PercentPipe, FilterBarComponent, LoadingSpinnerComponent, BudgetCurrencyPipe, TranslatePipe],
})
export class BudgetListComponent implements OnInit {
  private readonly budgetSvc = inject(BudgetService);
  private readonly filterSvc = inject(FilterService);

  items$!: Observable<BudgetItem[]>;
  currency: 'CRC' | 'USD' = 'CRC';
  sortField: SortField = 'year';
  sortDir: 'asc' | 'desc' = 'desc';

  ngOnInit(): void {
    this.filterSvc.filter$.subscribe(f => (this.currency = f.currency));
    this.items$ = this.filterSvc.filter$.pipe(
      switchMap(filter => this.budgetSvc.getFilteredItems(filter))
    );
  }

  sort(field: SortField): void {
    this.sortDir = this.sortField === field && this.sortDir === 'desc' ? 'asc' : 'desc';
    this.sortField = field;
  }

  sorted(items: BudgetItem[]): BudgetItem[] {
    return [...items].sort((a, b) => {
      const av = a[this.sortField] ?? 0;
      const bv = b[this.sortField] ?? 0;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
  }

  sortIcon(field: SortField): string {
    if (this.sortField !== field) return '↕';
    return this.sortDir === 'asc' ? '↑' : '↓';
  }
}
