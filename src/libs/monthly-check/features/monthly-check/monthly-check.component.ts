import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
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

  formModel = linkedSignal<Form>(() => {
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

  form = form(this.formModel);

  currentYearSnapshots = computed(() => {
    const year = this.selectedYear();
    return this.snapshots().filter((m) =>
      dayjs(m.month)
        .format('YYYY')
        .includes(year || '')
    );
  });
  selectedMonth = computed(() => this.formModel().snapshot);
  selectedYear = computed(() => this.formModel().year);

  balance = computed(() => {
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
    const { snapshot, year } = this.formModel();
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
