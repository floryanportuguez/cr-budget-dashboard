import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate.service';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly svc = inject(TranslateService);

  transform(key: string, params?: Record<string, string>): string {
    return this.svc.instant(key, params);
  }
}
