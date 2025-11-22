import { Component, computed, input } from '@angular/core';
import { Icon } from '@haushaltsbuch/shared/util-icons';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  imports: [LucideAngularModule],
  template: ` <i-lucide [name]="icon()" [size]="_size()" />`,
})
export class IconComponent {
  icon = input.required<Icon>();

  size = input<'mini' | 'small' | 'medium' | 'large'>('small');

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
}
