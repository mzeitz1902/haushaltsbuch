import { Routes } from '@angular/router';
import { provideFixedCostsDomain } from '../libs/fixed-costs/domain';
import { provideUsersDomain } from '../libs/user/domain';
import { provideRevenueDomain } from '../libs/revenue/domain';
import { authGuard } from '../libs/user/domain/application/auth.guard';
import { loginRedirectGuard } from '../libs/user/domain/application/login-redirect.guard';
import { provideMonthlyCheckDomain } from '@haushaltsbuch/monthly-check/domain';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    providers: [provideUsersDomain()],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@haushaltsbuch/user/features').then((m) => m.LoginPageComponent),
    canActivate: [loginRedirectGuard],
  },
  {
    path: 'base',
    loadComponent: () =>
      import('@haushaltsbuch/base/features').then((m) => m.BaseComponent),
    providers: [provideFixedCostsDomain(), provideRevenueDomain()],
    canActivate: [authGuard],
  },
  {
    path: 'weekly-check',
    loadComponent: () =>
      import('@haushaltsbuch/weekly-check/features').then(
        (m) => m.WeeklyCheckComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'monthly-check',
    loadComponent: () =>
      import('@haushaltsbuch/monthly-check/features').then(
        (m) => m.MonthlyCheckComponent
      ),
    canActivate: [authGuard],
    providers: [provideMonthlyCheckDomain()],
  },
];
