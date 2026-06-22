import {
  Component, Input, OnInit, OnChanges,
  OnDestroy, ViewChild, ElementRef,
} from '@angular/core';
import { Chart, ChartType, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-wrapper',
  standalone: true,
  templateUrl: './chart-wrapper.component.html',
  styleUrl: './chart-wrapper.component.scss',
})
export class ChartWrapperComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) type!: ChartType;
  @Input({ required: true }) data!: ChartData;
  @Input() options: ChartOptions = {};

  private chart?: Chart;

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.data    = this.data;
      this.chart.options = this.mergedOptions;
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private createChart(): void {
    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.type,
      data: this.data,
      options: this.mergedOptions,
    });
  }

  private get mergedOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      ...this.options,
    };
  }
}
