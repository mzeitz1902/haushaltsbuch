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
    <mat-card>
      <mat-card-content>
        <div
          class="grid h-5 w-full grid-cols-[1.5rem_6.5rem_1rem] items-center gap-2"
        >
          <app-icon icon="Scale" size="medium" />
          <span class="text-sm font-semibold">Saldo</span>

          <h1
            class="text-(length:--text-xs) leading-(--text-sm--line-height) font-medium"
          >
            {{ balance() | currency }}
          </h1>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class BalanceComponent {
  balance = input.required<number>();
}
