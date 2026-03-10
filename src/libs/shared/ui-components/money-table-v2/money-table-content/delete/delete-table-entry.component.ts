import { Component, output } from '@angular/core';
import { ButtonComponent } from '@haushaltsbuch/shared/ui-components';
import {
  HlmDialog,
  HlmDialogClose,
  HlmDialogContent,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogPortal,
  HlmDialogTitle,
  HlmDialogTrigger,
} from '@spartan-ng/helm/dialog';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-delete-table-entry',
  imports: [
    ButtonComponent,
    HlmDialog,
    HlmDialogClose,
    HlmDialogContent,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogPortal,
    HlmDialogTitle,
    HlmDialogTrigger,
    HlmButton,
  ],
  templateUrl: './delete-table-entry.component.html',
  styles: ``,
})
export class DeleteTableEntryComponent {
  deleteClick = output();
}
