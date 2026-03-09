import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { HlmButton } from '@spartan-ng/helm/button';
import { LucideAngularModule } from 'lucide-angular';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-bottom-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    HlmButton,
    LucideAngularModule,
    NgClass,
  ],
  template: `
    <mat-toolbar
      class="flex w-full! items-center justify-center border-t-1 border-gray-100 bg-gray-800!"
    >
      <div class="grid w-full grid-cols-3 items-center gap-3 *:text-white">
        <button
          hlmBtn
          class="dark"
          variant="ghost"
          icon="HandCoins"
          routerLink="base"
          routerLinkActive
          #base="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          [ngClass]="{ 'bg-accent/50': base.isActive }"
        >
          Basis
        </button>
        <button
          hlmBtn
          variant="ghost"
          icon="ReceiptEuro"
          routerLink="weekly-check"
          routerLinkActive
          #weeklyCheck="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          [ngClass]="{ 'bg-accent/50': weeklyCheck.isActive }"
        >
          Woche
        </button>
        <button
          hlmBtn
          variant="ghost"
          icon="Calendar"
          routerLink="monthly-check"
          routerLinkActive
          #monthlyCheck="routerLinkActive"
          [ngClass]="{ 'bg-accent/50': monthlyCheck.isActive }"
        >
          Monat
        </button>
      </div>
    </mat-toolbar>
  `,
  host: {
    class: 'sticky bottom-0 z-10 w-full',
  },
})
export class BottomNavComponent {}
