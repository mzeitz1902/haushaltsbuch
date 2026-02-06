import { Routes } from '@angular/router';
import { provideFixedCostsDomain } from '../libs/fixed-costs/domain';
import { provideUsersDomain } from '../libs/user/domain';
import { provideRevenueDomain } from '../libs/revenue/domain';
import { authGuard } from '../libs/user/domain/application/auth.guard';
import { loginRedirectGuard } from '../libs/user/domain/application/login-redirect.guard';
import { provideMonthlyCheckDomain } from '@haushaltsbuch/monthly-check/domain';
import { provideWeeklyCheckDomain } from '@haushaltsbuch/weekly-check/domain';
import { monthlyCheckRedirect } from './monthly-check-redirect';

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
    providers: [provideWeeklyCheckDomain()],
  },
  {
    path: 'monthly-check',
    providers: [provideMonthlyCheckDomain(), provideWeeklyCheckDomain()],
    canActivate: [authGuard, monthlyCheckRedirect()],
    children: [
      {
        path: ':year',
        loadComponent: () =>
          import('@haushaltsbuch/monthly-check/features').then(
            (m) => m.MonthlyCheckComponent
          ),
      },
      {
        path: ':year/:month',
        loadComponent: () =>
          import('@haushaltsbuch/monthly-check/features').then(
            (m) => m.MonthlyCheckComponent
          ),
      },
    ],
  },
];
