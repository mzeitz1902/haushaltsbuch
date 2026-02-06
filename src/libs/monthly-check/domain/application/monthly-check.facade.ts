import { computed, inject, Injectable } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { monthlyCheckEvents } from '../+state/monthly-check.events';
import { monthlyCheckStore } from '../+state/monthly-check.store';
import dayjs from 'dayjs';
import {
  CreatedMonth,
  HistoryEntry,
  VariableCost,
} from '@haushaltsbuch/monthly-check/domain';
import { Revenue } from '@haushaltsbuch/revenue/domain';
import { Router } from '@angular/router';
import { FixedCost } from '@haushaltsbuch/fixed-costs/domain';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class MonthlyCheckFacade {
  private readonly events = injectDispatch(monthlyCheckEvents);
  private readonly store = inject(monthlyCheckStore);
  private readonly router = inject(Router);

  currentMonth = this.store.month;
  currentWeek = this.store.currentWeek;
  currentWeek$ = toObservable(this.store.currentWeek);
  areMonthsLoaded = computed(
    () => this.store.getCreatedMonthsProcessStatus() === 'success'
  );
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
  isHistoryEntryAdded = computed(
    () => this.store.addHistoryEntryProcessStatus() === 'success'
  );
  isBudgetAdded = computed(
    () => this.store.addBudgetProcessStatus() === 'success'
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

  budgets = computed(() => this.currentMonth()?.budget_lines ?? []);
  totalBudgets = computed(() => {
    const budgets = this.budgets();
    if (budgets.length === 0) {
      return 0;
    }
    return budgets.reduce((sum, b) => sum + b.value!, 0);
  });

  snapshots = computed<CreatedMonth[]>(() =>
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
    const _month = `${month}-01`;
    this.events.getMonth(_month);
  }

  getCurrentWeek() {
    this.events.getCurrentWeek();
  }

  addRevenue() {
    this.events.addRevenue();
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

  addVariableCost() {
    this.events.addVariableCost(this.currentMonth()!.id);
  }

  updateVariableCost(variableCost: VariableCost) {
    this.events.updateVariableCost({
      variableCost,
      monthId: this.currentMonth()!.id,
    });
  }

  deleteVariableCost(variableCostId: number) {
    this.events.deleteVariableCost({
      monthId: this.currentMonth()!.id,
      variableCostId,
    });
  }

  addVariableCostHistoryEntry(variableCostId: string) {
    this.events.addVariableCostHistoryEntry({
      variableCostId,
      monthId: this.currentMonth()!.id,
    });
  }

  deleteVariableCostHistoryEntry(variableCostId: string, entryId: string) {
    this.events.deleteVariableCostHistoryEntry({
      monthId: this.currentMonth()!.id,
      variableCostId,
      entryId,
    });
  }

  updateVariableCostHistoryEntry(variableCostId: string, entry: HistoryEntry) {
    this.events.updateVariableCostHistoryEntry({
      monthId: this.currentMonth()!.id,
      variableCostId,
      entry,
    });
  }

  addBudget() {
    this.events.addBudget();
  }

  updateBudget(budget: VariableCost) {
    this.events.updateBudget(budget);
  }

  deleteBudget(budgetId: number) {
    this.events.deleteBudget(budgetId.toString());
  }

  addBudgetHistoryEntry(budgetId: string) {
    this.events.addBudgetHistoryEntry(budgetId);
  }

  deleteBudgetHistoryEntry(budgetId: string, entryId: string) {
    this.events.deleteBudgetHistoryEntry({ budgetId, entryId });
  }

  updateBudgetHistoryEntry(budgetId: string, entry: HistoryEntry) {
    this.events.updateBudgetHistoryEntry({
      budgetId,
      entry,
    });
  }

  navigateTo(year?: string | null, month?: string | null) {
    if (year && !month) {
      this.router.navigate(['/monthly-check', year]);
      return;
    }
    this.router.navigate(['/monthly-check', year, month]);
  }
}
