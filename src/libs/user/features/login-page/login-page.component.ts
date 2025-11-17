import { Component, inject, signal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import { UsersFacade } from '@haushaltsbuch/user/domain';

@Component({
  selector: 'app-login-page',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    LucideAngularModule,
    ButtonComponent,
    MatError,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly facade = inject(UsersFacade);

  loginError = this.facade.loginError;

  readonly hidePassword = signal(true);

  form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', Validators.required),
  });

  toggleVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  login() {
    if (this.form.invalid) {
      this.form.updateValueAndValidity();
      return;
    }
    const formValue = this.form.getRawValue();
    this.facade.login(formValue.email, formValue.password);
  }
}
