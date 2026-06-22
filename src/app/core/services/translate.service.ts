import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private translations: Record<string, any> = {};
  private readonly _lang$ = new BehaviorSubject<Lang>('es');

  readonly lang$ = this._lang$.asObservable();

  get currentLang(): Lang {
    return this._lang$.getValue();
  }

  async load(lang: Lang): Promise<void> {
    const res  = await fetch(`assets/i18n/${lang}.json`);
    this.translations = await res.json();
    this._lang$.next(lang);
  }

  instant(key: string, params?: Record<string, string>): string {
    const value = key.split('.').reduce<any>((obj, k) => obj?.[k], this.translations);
    if (typeof value !== 'string') return key;
    if (!params) return value;
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(new RegExp(`{{${k}}}`, 'g'), v),
      value
    );
  }

  async toggle(): Promise<void> {
    const next: Lang = this.currentLang === 'es' ? 'en' : 'es';
    await this.load(next);
  }
}
