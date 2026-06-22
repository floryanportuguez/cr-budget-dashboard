import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'budget-list',
    loadComponent: () =>
      import('./features/budget-list/budget-list.component').then(m => m.BudgetListComponent),
  },
  {
    path: 'charts',
    loadComponent: () =>
      import('./features/chart-view/chart-view.component').then(m => m.ChartViewComponent),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
