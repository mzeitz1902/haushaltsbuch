import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { LucideAngularModule } from 'lucide-angular';
import { icons } from '@haushaltsbuch/shared/util-icons';
import { provideAppInitializers } from './app-initializers';
import { provideUsersDomain } from '../libs/user/domain';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/de';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.locale('de');
dayjs.extend(localeData);
dayjs.extend(weekOfYear);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    importProvidersFrom(LucideAngularModule.pick(icons)),
    provideUsersDomain(),
    provideAppInitializers(),
    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
  ],
};
