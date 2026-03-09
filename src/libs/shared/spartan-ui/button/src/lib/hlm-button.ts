import { Component, input, signal } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';
import { Icon } from '@haushaltsbuch/shared/util-icons';
import { LucideAngularModule } from 'lucide-angular';

export const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_i-lucide]:pointer-events-none [&_i-lucide]:shrink-0 [&_i-lucide:not([class*='text-'])]:text-base",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
        outline:
          'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>i-lucide]:px-3',
        xs: `h-6 gap-1 rounded-md px-2 text-xs has-[>i-lucide]:px-1.5 [&_i-lucide:not([class*='text-'])]:text-xs`,
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>i-lucide]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>i-lucide]:px-4',
        icon: 'size-9',
        'icon-xs': `size-6 rounded-md [&_i-lucide:not([class*='text-'])]:text-xs`,
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'button[hlmBtn], a[hlmBtn]',
  exportAs: 'hlmBtn',
  hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
  host: {
    'data-slot': 'button',
  },
  template: `
    @if (icon(); as icon) {
      <i-lucide [name]="icon" size="16" />
    }
    <ng-content />
  `,
  imports: [LucideAngularModule],
})
export class HlmButton {
  private readonly _config = injectBrnButtonConfig();

  private readonly _additionalClasses = signal<ClassValue>('');

  public readonly variant = input<ButtonVariants['variant']>(
    this._config.variant
  );

  public readonly size = input<ButtonVariants['size']>(this._config.size);

  icon = input<Icon>();

  constructor() {
    classes(() => [
      buttonVariants({ variant: this.variant(), size: this.size() }),
      this._additionalClasses(),
    ]);
  }

  setClass(classes: string): void {
    this._additionalClasses.set(classes);
  }
}
