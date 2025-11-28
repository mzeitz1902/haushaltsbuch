import { computed, inject, Injectable } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { monthlyCheckEvents } from '../+state/monthly-check.events';
import { monthlyCheckStore } from '../+state/monthly-check.store';
import dayjs from 'dayjs';
import { CreatedMonth } from '@haushaltsbuch/monthly-check/domain';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { Router } from '@angular/router';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';

@Injectable()
export class MonthlyCheckFacade {
  private readonly events = injectDispatch(monthlyCheckEvents);
  private readonly store = inject(monthlyCheckStore);
  private readonly router = inject(Router);

  currentMonth = this.store.month;

  isMonthLoading = computed(
    () => this.store.getMonthProcessStatus() === 'pending'
  );
  isMonthLoaded = computed(
    () => this.store.getMonthProcessStatus() === 'success'
  );

  isSavingRevenue = computed(
    () => this.store.saveRevenueProcessStatus() === 'pending'
  );
  isRevenueAdded = computed(
    () => this.store.addRevenueProcessStatus() === 'success'
  );
  isSavingFixedCost = computed(
    () => this.store.saveFixedCostProcessStatus() === 'pending'
  );
  isFixedCostAdded = computed(
    () => this.store.addFixedCostProcessStatus() === 'success'
  );
  isSavingVariableCost = computed(
    () => this.store.saveVariableCostProcessStatus() === 'pending'
  );
  isVariableCostAdded = computed(
    () => this.store.addVariableCostProcessStatus() === 'success'
  );

  revenue = computed(
    () => (this.currentMonth()?.revenue_lines ?? []) as Revenue[]
  );
  totalRevenue = computed(() => this.currentMonth()?.revenue_total ?? 0);

  fixedCosts = computed(
    () => (this.currentMonth()?.fixed_costs_lines ?? []) as FixedCost[]
  );
  totalFixedCosts = computed(() => this.currentMonth()?.fixed_costs_total ?? 0);

  variableCosts = computed(
    () => this.currentMonth()?.variable_costs_lines ?? []
  );
  totalVariableCosts = computed(
    () => this.currentMonth()?.variable_costs_total ?? 0
  );

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

  addRevenue() {
    this.events.addRevenue(this.currentMonth()!.id);
  }

  updateRevenue(revenue: Revenue) {
    this.events.updateRevenue({ revenue, monthId: this.currentMonth()!.id });
  }

  deleteRevenue(revenueId: number) {
    this.events.deleteRevenue({ monthId: this.currentMonth()!.id, revenueId });
  }

  addFixedCost() {
    this.events.addFixedCost(this.currentMonth()!.id);
  }

  updateFixedCost(fixedCost: FixedCost) {
    this.events.updateFixedCost({
      fixedCost,
      monthId: this.currentMonth()!.id,
    });
  }

  deleteFixedCost(fixedCostId: number) {
    this.events.deleteFixedCost({
      monthId: this.currentMonth()!.id,
      fixedCostId,
    });
  }

  navigateTo(year?: string | null, month?: string | null) {
    this.router.navigate(['/monthly-check', year, month]);
  }
}
