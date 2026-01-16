import { Component, computed, input } from '@angular/core';
import { Week } from '@haushaltsbuch/weekly-check/domain';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { IconComponent } from '@haushaltsbuch/shared/ui-components';
import dayjs from 'dayjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-week',
  imports: [MatCard, MatCardContent, CdkAccordionItem, IconComponent, DatePipe],
  templateUrl: './week.component.html',
})
export class WeekComponent {
  week = input.required<Week>();

  today = dayjs();

  isExpanded = computed(() => {
    const week = this.week();

    return (
      dayjs(week.dateFrom).isBefore(this.today, 'day') &&
      dayjs(week.dateTo).isAfter(this.today, 'day')
    );
  });
}
