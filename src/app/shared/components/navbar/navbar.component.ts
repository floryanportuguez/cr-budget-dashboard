import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateService, Lang } from '../../../core/services/translate.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, RouterLinkActive, FormsModule, TranslatePipe],
})
export class NavbarComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  currentLang: Lang = 'es';

  ngOnInit(): void {
    this.translate.lang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  async onLangChange(lang: Lang): Promise<void> {
    await this.translate.load(lang);
  }
}