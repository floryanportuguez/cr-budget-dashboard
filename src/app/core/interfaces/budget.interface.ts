// ─── Datos crudos del JSON ───────────────────────────────────────────────────
export interface BudgetData {
  country: string;
  currency: string;
  years: number[];
  sectors: Sector[];
  items: BudgetItem[];
}

export interface Sector {
  id: string;
  name: string;
  color: string;
}

export interface BudgetItem {
  id: number;
  year: number;
  sectorId: string;
  budgeted: number;
  executed: number;
  executionRate?: number;
  executionStatus?: ExecutionStatus;
}

// ─── Filtros ─────────────────────────────────────────────────────────────────
export interface BudgetFilter {
  year: number | null;
  sectorId: string | null;
  currency: 'CRC' | 'USD';
}

// ─── Vistas calculadas ────────────────────────────────────────────────────────
export interface KpiSummary {
  totalBudgeted: number;
  totalExecuted: number;
  executionRate: number;
  activeSectors: number;
  unexecuted: number;
}

export interface SectorSummary {
  sector: Sector;
  budgeted: number;
  executed: number;
  executionRate: number;
  status: ExecutionStatus;
}

export interface YearlyTotal {
  year: number;
  budgeted: number;
  executed: number;
  executionRate: number;
}

// ─── Enums y constantes ───────────────────────────────────────────────────────
export type ExecutionStatus = 'optimal' | 'at-risk' | 'low';
export type SortDirection   = 'asc' | 'desc';
export type Currency        = 'CRC' | 'USD';

export const EXECUTION_THRESHOLDS = {
  optimal: 80,
  atRisk:  60,
} as const;

export const CRC_TO_USD = 0.00019;
