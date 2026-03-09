import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  Week,
  WeeklyCheckEntry,
  WeeklyCheckShops,
} from '@haushaltsbuch/weekly-check/domain';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { IconComponent } from '@haushaltsbuch/shared/ui-components';
import dayjs from 'dayjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ShopComponent } from './weekly-entry/shop.component';
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-week',
  imports: [
    CdkAccordionItem,
    IconComponent,
    DatePipe,
    ShopComponent,
    CurrencyPipe,
    HlmCard,
    HlmCardContent,
  ],
  templateUrl: './week.component.html',
})
export class WeekComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

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

  scrollIntoView() {
    this.host.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}

interface Entry {
  label: string;
  entry: WeeklyCheckEntry;
  shop: keyof WeeklyCheckShops;
}
