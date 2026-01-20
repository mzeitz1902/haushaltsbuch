import {
  Component,
  inject,
  input,
  signal,
  ViewContainerRef,
} from '@angular/core';
import {
  WeeklyCheckEntry,
  WeeklyCheckShops,
} from '@haushaltsbuch/weekly-check/domain';
import { CurrencyPipe } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  WeeklyHistoryComponent,
  WeeklyHistoryData,
} from './weekly-history/weekly-history.component';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-weekly-check-shop',
  imports: [CurrencyPipe],
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly viewContainerRef = inject(ViewContainerRef);

  weeklyCheckId = input.required<number>();
  label = input.required<string>();
  entry = input.required<WeeklyCheckEntry>();
  shop = input.required<keyof WeeklyCheckShops>();

  isOpened = signal(false);

  openBottomSheet() {
    this.isOpened.set(true);
    const data: WeeklyHistoryData = {
      weeklyCheckId: this.weeklyCheckId(),
      history: this.entry().history,
      shop: this.shop(),
    };
    this.bottomSheet
      .open(WeeklyHistoryComponent, {
        data,
        viewContainerRef: this.viewContainerRef,
      })
      .afterDismissed()
      .pipe(
        take(1),
        tap(() => this.isOpened.set(false))
      )
      .subscribe();
  }
}
