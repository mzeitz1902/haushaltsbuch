import { Component, computed, input, viewChild } from '@angular/core';
import {
  Week,
  WeeklyCheckEntry,
  WeeklyCheckShops,
} from '@haushaltsbuch/weekly-check/domain';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { IconComponent } from '@haushaltsbuch/shared/ui-components';
import dayjs from 'dayjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ShopComponent } from './weekly-entry/shop.component';

import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

@Component({
  selector: 'app-week',
  imports: [
    MatCard,
    MatCardContent,
    CdkAccordionItem,
    IconComponent,
    DatePipe,
    ShopComponent,
    CurrencyPipe,
  ],
  templateUrl: './week.component.html',
})
export class WeekComponent {
  week = input.required<Week>();

  item = viewChild.required(CdkAccordionItem);

  entries = computed<Entry[]>(() => {
    const week = this.week();
    return [
      { label: 'Lidl', entry: week.lidl, shop: 'lidl' },
      {
        label: 'Drogerie',
        entry: week.drugstore,
        shop: 'drugstore',
      },
      {
        label: 'Edeka',
        entry: week.edeka,
        shop: 'edeka',
      },
      { label: 'Sonstige', entry: week.misc, shop: 'misc' },
      { label: 'Kaufland', entry: week.kaufland, shop: 'kaufland' },
      { label: 'Auswärts', entry: week.away, shop: 'away' },
      {
        label: 'Bäcker / Fleischer',
        entry: week.baker_butcher,
        shop: 'baker_butcher',
      },
    ];
  });

  isCurrent = computed(() => {
    const week = this.week();
    const currentCw = dayjs().week();
    return week.cw === currentCw;
  });
}

interface Entry {
  label: string;
  entry: WeeklyCheckEntry;
  shop: keyof WeeklyCheckShops;
}
