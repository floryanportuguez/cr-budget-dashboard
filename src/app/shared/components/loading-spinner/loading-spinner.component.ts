import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  imports: [NgIf],
})
export class LoadingSpinnerComponent {
  @Input() message?: string;
  @Input() minHeight = '200px';
}
