import { computed, inject, Injectable } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { monthlyCheckEvents } from '../+state/monthly-check.events';
import { monthlyCheckStore } from '../+state/monthly-check.store';
import dayjs from 'dayjs';
import { CreatedMonth } from '@haushaltsbuch/monthly-check/domain';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { Router } from '@angular/router';

@Injectable()
export class MonthlyCheckFacade {
  private readonly events = injectDispatch(monthlyCheckEvents);
  private readonly store = inject(monthlyCheckStore);
  private readonly router = inject(Router);

  currentMonth = this.store.month;

  isLoading = computed(() => this.store.getProcessStatus() === 'pending');
  isLoaded = computed(() => this.store.getProcessStatus() === 'success');
  isSaving = computed(
    () => this.store.saveRevenueProcessStatus() === 'pending'
  );
  isRevenueAdded = computed(
    () => this.store.addRevenueProcessStatus() === 'success'
  );

  revenue = computed(
    () => (this.currentMonth()?.revenue_lines ?? []) as Revenue[]
  );
  totalRevenue = computed(() => this.currentMonth()?.revenue_total ?? 0);

  createdMonths = computed<CreatedMonth[]>(() =>
    this.store.createdMonths().map((m) => {
      return {
        month: m,
        translated: dayjs(m).format('MMMM'),
      };
    })
  );
  createdYears = computed(() =>
    Array.from(
      new Set(this.store.createdMonths().map((m) => dayjs(m).format('YYYY')))
    )
  );

  createMonth(month: string) {
    this.events.create(month);
  }

  getCreatedMonths() {
    this.events.getCreatedMonths();
  }

  getMonth(month: string) {
    this.events.getMonth(month);
  }

  updateRevenue(revenue: Revenue) {
    this.events.updateRevenue({ revenue, monthId: this.currentMonth()!.id });
  }

  navigateTo(year?: string | null, month?: string | null) {
    this.router.navigate(['/monthly-check', year, month]);
  }
}
