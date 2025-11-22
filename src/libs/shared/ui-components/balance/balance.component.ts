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
        <div class="grid h-5 w-full grid-cols-[127px_1fr] items-center gap-4">
          <div class="flex items-center gap-1">
            <app-icon icon="Scale" size="medium" />
            <span class="text-sm font-semibold">Saldo:</span>
          </div>

          <h1
            class="text-(length:--text-xs) leading-(--text-sm--line-height) font-medium"
          >
            {{ balance() | currency: 'EUR' }}
          </h1>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class BalanceComponent {
  balance = input.required<number>();
}
