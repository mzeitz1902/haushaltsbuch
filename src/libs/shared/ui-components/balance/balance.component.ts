import { Component, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-balance',
  imports: [
    MatCard,
    CurrencyPipe,
    MatCardContent,
    LucideAngularModule,
    IconComponent,
  ],
  template: `
    <mat-card class="h-18">
      <mat-card-content>
        <div
          class="mb-2 grid h-5 w-full grid-cols-[min-content_1fr_1fr_1rem] items-center gap-2"
        >
          <app-icon #col1 icon="Scale" size="medium" />
          <span #col2Title class="text-s font-semibold">Saldo</span>

          <div class="grid grid-cols-2" #col3>
            <span class="text-right text-xs">Forecast</span>
            <span class="text-right text-xs">Real</span>
            <h1
              class="text-right text-(length:--text-s) leading-(--text-sm--line-height) font-semibold"
              [class.text-green-500]="balanceReal() >= 0"
              [class.text-red-500]="balanceReal() < 0"
            >
              {{ balanceForecast() | currency }}
            </h1>
            <h1
              #col3Value
              class="text-right text-(length:--text-s) leading-(--text-sm--line-height) font-semibold"
              [class.text-green-500]="balanceReal() >= 0"
              [class.text-red-500]="balanceReal() < 0"
            >
              {{ balanceReal() | currency }}
            </h1>
          </div>
          <div></div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class BalanceComponent {
  balanceReal = input.required<number>();
  balanceForecast = input<number>();
}
