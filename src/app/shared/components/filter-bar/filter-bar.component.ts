import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FilterService } from '../../../core/services/filter.service';
import { BudgetService } from '../../../core/services/budget.service';
import { BudgetData } from '../../../core/interfaces/budget.interface';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [AsyncPipe, NgIf, FormsModule, TranslatePipe],
})
export class FilterBarComponent implements OnInit {
  private readonly filterSvc = inject(FilterService);
  private readonly budgetSvc = inject(BudgetService);

  data$!: Observable<BudgetData>;
  selectedYear: number | null     = null;
  selectedSector: string | null   = null;
  selectedCurrency: 'CRC' | 'USD' = 'CRC';

  ngOnInit(): void {
    this.data$ = this.budgetSvc.getData();
    const f = this.filterSvc.current;
    this.selectedYear     = f.year;
    this.selectedSector   = f.sectorId;
    this.selectedCurrency = f.currency;
  }

  onYearChange(val: string | null): void {
    this.selectedYear = (val === 'null' || val === '' || !val) ? null : +val;
    this.filterSvc.setYear(this.selectedYear);
  }

  onSectorChange(val: string | null): void {
    this.selectedSector = (val === 'null' || val === '' || !val) ? null : val;
    this.filterSvc.setSector(this.selectedSector);
  }

  onCurrencyChange(val: 'CRC' | 'USD'): void {
    this.selectedCurrency = val;
    this.filterSvc.setCurrency(val);
  }

  onReset(): void {
    this.filterSvc.reset();
    this.selectedYear     = null;
    this.selectedSector   = null;
    this.selectedCurrency = 'CRC';
  }
}