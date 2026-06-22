import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { TranslateService } from './core/services/translate.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, NavbarComponent],
})
export class AppComponent implements OnInit {
  private readonly translate = inject(TranslateService);

  async ngOnInit(): Promise<void> {
    await this.translate.load('es');
  }
}
