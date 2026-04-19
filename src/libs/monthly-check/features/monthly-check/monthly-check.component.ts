import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { MonthlyCheckFacade } from '@haushaltsbuch/monthly-check/domain';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AppHeaderComponent,
  BalanceComponent,
  ButtonComponent,
} from '@haushaltsbuch/shared/ui-components';
import dayjs from 'dayjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { form, FormField } from '@angular/forms/signals';
import { RevenueMonthTableComponent } from './revenue-month-table/revenue-month-table.component';
import { FixedCostsMonthTableComponent } from './fixed-costs-month-table/fixed-costs-month-table.component';
import { CdkAccordion } from '@angular/cdk/accordion';
import { VariableCostsTableComponent } from './variable-costs-table/variable-costs-table.component';
import { CreateMonthDialogComponent } from './create-month-dialog/create-month-dialog.component';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { take } from 'rxjs';
import { MonthlyBudgetsTableComponent } from './monthly-budgets-table/monthly-budgets-table.component';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-monthly-check',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    NgSelectComponent,
    AppHeaderComponent,
    RevenueMonthTableComponent,
    FixedCostsMonthTableComponent,
    CdkAccordion,
    VariableCostsTableComponent,
    ButtonComponent,
    BalanceComponent,
    MonthlyBudgetsTableComponent,
    FormField,
    HlmInputImports,
  ],
  templateUrl: './monthly-check.component.html',
})
export class MonthlyCheckComponent {
  private readonly monthlyCheckFacade = inject(MonthlyCheckFacade);
  private readonly mtxDialog = inject(MtxDialog);

  year = input<string>(); // from route
  month = input<string>(); // from route

  snapshots = this.monthlyCheckFacade.snapshots;
  createdYears = this.monthlyCheckFacade.createdYears;

  yearMonthFormModel = linkedSignal<Form>(() => {
    let snapshot = dayjs().format('YYYY-MM-DD');
    let year = this.year()!;
    if (this.year() && this.month()) {
      snapshot = `${this.year()}-${this.month()}`;
    }
    // User entered a year that has no been created yet -> set year to null
    if (year && !this.isYearValid(year)) {
      year = null!;
    }
    return {
      snapshot,
      year,
    };
  });
  searchFormModel = signal('');

  yearMonthForm = form(this.yearMonthFormModel);
  searchForm = form(this.searchFormModel);

  searchTerm = computed(() => this.searchFormModel().toLowerCase());

  filteredRevenue = computed(() => {
    const term = this.searchTerm();
    const data = this.monthlyCheckFacade.revenue();
    if (!term) return data;
    return data.filter((item) => item.category?.toLowerCase().includes(term));
  });

  filteredRevenueTotal = computed(() =>
    this.filteredRevenue().reduce((sum, item) => sum + (item.value ?? 0), 0)
  );

  filteredFixedCosts = computed(() => {
    const term = this.searchTerm();
    const data = this.monthlyCheckFacade.fixedCosts();
    if (!term) return data;
    return data.filter((item) => item.category?.toLowerCase().includes(term));
  });

  filteredFixedCostsTotal = computed(() =>
    this.filteredFixedCosts().reduce((sum, item) => sum + (item.value ?? 0), 0)
  );

  filteredBudgets = computed(() => {
    const term = this.searchTerm();
    const data = this.monthlyCheckFacade.budgets();
    if (!term) return data;
    return data.filter((item) => item.category?.toLowerCase().includes(term));
  });

  filteredBudgetsTotal = computed(() =>
    this.filteredBudgets().reduce((sum, item) => sum + (item.value ?? 0), 0)
  );

  filteredVariableCosts = computed(() => {
    const term = this.searchTerm();
    const data = this.monthlyCheckFacade.variableCosts();
    if (!term) return data;
    return data.filter((item) => item.category?.toLowerCase().includes(term));
  });

  filteredVariableCostsTotal = computed(() =>
    this.filteredVariableCosts().reduce(
      (sum, item) => sum + (item.value ?? 0),
      0
    )
  );

  hasSearchResults = computed(() => {
    const term = this.searchTerm();
    if (!term) return true;
    return (
      this.filteredRevenue().length > 0 ||
      this.filteredFixedCosts().length > 0 ||
      this.filteredBudgets().length > 0 ||
      this.filteredVariableCosts().length > 0
    );
  });

  currentYearSnapshots = computed(() => {
    const year = this.selectedYear();
    return this.snapshots().filter((m) =>
      dayjs(m.month)
        .format('YYYY')
        .includes(year || '')
    );
  });
  selectedMonth = computed(() => this.yearMonthFormModel().snapshot);
  selectedYear = computed(() => this.yearMonthFormModel().year);

  balanceForecast = computed(() => {
    const totalFixedCosts = this.monthlyCheckFacade.totalFixedCosts();
    const totalVariableCosts = this.monthlyCheckFacade.totalVariableCosts();
    const totalRevenue = this.monthlyCheckFacade.totalRevenue();
    const totalBudgetForecasts = this.monthlyCheckFacade.totalBudgetForecasts();
    return (
      totalRevenue -
      (totalFixedCosts + totalVariableCosts + totalBudgetForecasts)
    );
  });

  balanceReal = computed(() => {
    const totalFixedCosts = this.monthlyCheckFacade.totalFixedCosts();
    const totalVariableCosts = this.monthlyCheckFacade.totalVariableCosts();
    const totalRevenue = this.monthlyCheckFacade.totalRevenue();
    const totalBudgets = this.monthlyCheckFacade.totalBudgets();
    return totalRevenue - (totalFixedCosts + totalVariableCosts + totalBudgets);
  });

  loadMonth = effect(() => {
    const snapshot = this.selectedMonth();
    const year = this.selectedYear();
    if (
      snapshot &&
      year &&
      this.isYearValid(year) &&
      this.isSnapshotCreated(snapshot)
    ) {
      this.monthlyCheckFacade.getMonth(snapshot);
    }
  });

  navigateOnFormModelChange = effect(() => {
    const { snapshot, year } = this.yearMonthFormModel();
    const areMonthsLoaded = this.monthlyCheckFacade.areMonthsLoaded();
    untracked(() => {
      if (!areMonthsLoaded) return;
      const _month = snapshot ? dayjs(snapshot).format('MM') : null;
      if (year && !snapshot) {
        this.monthlyCheckFacade.navigateTo(year);
        return;
      }
      if (snapshot) {
        this.monthlyCheckFacade.navigateTo(year, _month);
      }
    });
  });

  constructor() {
    this.monthlyCheckFacade.getCreatedMonths();
  }

  openCreateMonthDialog() {
    const dialogRef = this.mtxDialog.originalOpen(CreateMonthDialogComponent, {
      height: '400px',
      data: {
        createdMonths: this.snapshots(),
      },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: { year: string; month: string }) => {
        this.createMonth(result);
      });
  }

  createMonth(result: { year: string; month: string }) {
    const dateString = `${result.year}-${result.month}-01`;
    this.monthlyCheckFacade.createMonth(dateString);
  }

  private isYearValid(year: string) {
    return this.createdYears().includes(year);
  }

  private isSnapshotCreated(month: string) {
    return this.snapshots()
      .map((m) => m.month)
      .includes(month);
  }
}

interface Form {
  snapshot: string | null;
  year: string | null;
}
