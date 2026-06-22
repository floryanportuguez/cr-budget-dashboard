import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
export type KpiTrend = 'up' | 'down' | 'neutral';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [NgIf],
})
export class KpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
  @Input() subtitle?: string;
  @Input() trend: KpiTrend = 'neutral';
}