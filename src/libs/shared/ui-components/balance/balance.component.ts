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
          class="grid h-5 w-full grid-cols-[min-content_7rem_1fr_1rem] items-center gap-2"
        >
          <app-icon #col1 icon="Scale" size="medium" />
          <span #col2Title class="text-s font-semibold">Saldo</span>

          <h1
            #col3Value
            class="text-right text-(length:--text-s) leading-(--text-sm--line-height) font-semibold"
            [class.text-green-500]="balance() >= 0"
            [class.text-red-500]="balance() < 0"
          >
            {{ balance() | currency }}
          </h1>
          <div></div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class BalanceComponent {
  balance = input.required<number>();
}
