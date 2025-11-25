import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-bottom-nav',
  imports: [ButtonComponent, RouterLink, RouterLinkActive, MatToolbar],
  template: `
    <mat-toolbar
      class="flex w-full! items-center justify-center border-t-1 border-gray-100 bg-gray-800!"
    >
      <div class="flex items-center justify-center gap-3">
        <button
          maffiButton
          icon="HandCoins"
          routerLink="base"
          routerLinkActive
          #base="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          [theme]="base.isActive ? 'plain' : 'inactive'"
        ></button>
        <button
          maffiButton
          icon="ReceiptEuro"
          routerLink="weekly-check"
          routerLinkActive
          #weeklyCheck="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          [theme]="weeklyCheck.isActive ? 'plain' : 'inactive'"
        ></button>
        <button
          maffiButton
          icon="Calendar"
          routerLink="monthly-check"
          routerLinkActive
          #monthlyCheck="routerLinkActive"
          [theme]="monthlyCheck.isActive ? 'plain' : 'inactive'"
        ></button>
      </div>
    </mat-toolbar>
  `,
  host: {
    class: 'sticky bottom-0 z-10 w-full',
  },
})
export class BottomNavComponent {}
