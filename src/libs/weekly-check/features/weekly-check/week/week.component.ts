import { Component, computed, input } from '@angular/core';
import { Week, WeeklyCheckEntry } from '@haushaltsbuch/weekly-check/domain';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { IconComponent } from '@haushaltsbuch/shared/ui-components';
import dayjs from 'dayjs';
import { DatePipe } from '@angular/common';
import { WeeklyEntryComponent } from './weekly-entry/weekly-entry.component';

@Component({
  selector: 'app-week',
  imports: [
    MatCard,
    MatCardContent,
    CdkAccordionItem,
    IconComponent,
    DatePipe,
    WeeklyEntryComponent,
  ],
  templateUrl: './week.component.html',
})
export class WeekComponent {
  week = input.required<Week>();

  entries = computed<Entry[]>(() => {
    const week = this.week();
    return [
      { label: 'Lidl', entry: week.lidl },
      { label: 'Drogerie', entry: week.drugstore },
      { label: 'Edeka', entry: week.edeka },
      { label: 'Sonstige', entry: week.misc },
      { label: 'Kaufland', entry: week.kaufland },
      { label: 'Auswärts', entry: week.away },
    ];
  });

  isExpanded = computed(() => {
    const week = this.week();
    const today = dayjs();

    return (
      dayjs(week.dateFrom).isBefore(today, 'day') &&
      dayjs(week.dateTo).isAfter(today, 'day')
    );
  });
}

interface Entry {
  label: string;
  entry: WeeklyCheckEntry;
}
