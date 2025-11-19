import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { Icon } from '../../util-icons';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[maffiButton]',
  standalone: true,
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[disabled]': 'isDisabled()',
  },
  imports: [LucideAngularModule],
})
export class ButtonComponent {
  icon = input<Icon>();
  theme = input<ButtonTheme>('primary');
  isLoading = input<boolean>(false);
  disabled = input<boolean>(false);
  size = input<'mini' | 'small' | 'medium' | 'large'>('small');

  noContentFallback = viewChild('noContentFallback');

  buttonType = computed<'button' | 'fab'>(() => {
    return this.icon() && this.noContentFallback() ? 'fab' : 'button';
  });

  _size = computed(() => {
    switch (this.size()) {
      case 'mini':
        return 12;
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
    }
  });

  isDisabled = computed(() => this.isLoading() || this.disabled());

  classes = computed(() => {
    const stylingClasses = `
      relative
      inline-flex
      gap-2
      items-center
      min-h-8
      text-xs
    `;

    const interactionClasses = `
      hover:cursor-pointer
      disabled:hover:cursor-auto

      focus-visible:outline-dotted
      focus-visible:outline-1
      focus-visible:outline-blue-700
      focus-visible:outline-offset-2

      disabled:text-black
      disabled:bg-gray-200

      transition-colors
    `;

    const typeClasses = this.getTypeClasses(this.buttonType());
    const themeClasses = this.getThemeClasses();

    return `${stylingClasses} ${interactionClasses} ${typeClasses} ${themeClasses}`;
  });

  private getThemeClasses(): string {
    switch (this.theme()) {
      case 'primary':
        return `
          text-white
          bg-blue-900
          hover:bg-blue-800
          active:bg-blue-800
        `;

      case 'secondary':
        return `
        text-gray-100
        hover:bg-gray-700
        active:bg-gray-700
        `;

      case 'plain':
        return `
          text-gray-100
        `;

      case 'inactive':
        return `
          text-neutral-400
          hover:text-gray-100
        `;

      default:
        throw new Error(
          `Theme ${this.theme()} is not supported for Button2Component`
        );
    }
  }

  private getTypeClasses(buttonType: 'button' | 'fab'): string {
    switch (buttonType) {
      case 'fab':
        return 'rounded-full aspect-square justify-center';
      case 'button':
        return 'px-4 py-2 w-fit rounded-lg justify-start';
    }
  }
}

type ButtonTheme = 'primary' | 'plain' | 'secondary' | 'inactive';
