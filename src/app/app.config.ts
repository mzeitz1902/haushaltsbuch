import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LucideAngularModule } from 'lucide-angular';
import { icons } from '@haushaltsbuch/shared/util-icons';
import { provideAppInitializers } from './app-initializers';
import { provideUsersDomain } from '../libs/user/domain';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick(icons)),
    provideUsersDomain(),
    provideAppInitializers(),
    { provide: LOCALE_ID, useValue: 'de-DE' },
  ],
};
