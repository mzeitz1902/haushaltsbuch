import { Component, inject, input } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { ButtonComponent } from '../button/button.component';
import { UsersFacade } from '@haushaltsbuch/user/domain';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, ButtonComponent],
  template: `
    <mat-toolbar
      class="sticky top-0 z-10 flex justify-between border-b-1 bg-gray-800! text-gray-100!"
    >
      <h1 class="text-2xl!">{{ title() }}</h1>
      <ng-content />
      <button maffiButton icon="LogOut" (click)="logout()"></button>
    </mat-toolbar>
  `,
})
export class AppHeaderComponent {
  private readonly usersFacade = inject(UsersFacade);

  title = input.required<string>();

  logout() {
    this.usersFacade.logout();
  }
}
