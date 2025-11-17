import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UsersFacade } from '@haushaltsbuch/user/domain';
import { BottomNavComponent } from '@haushaltsbuch/shared/ui-components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LucideAngularModule, BottomNavComponent],
  templateUrl: './app.component.html',
  host: {
    class: 'h-screen block',
  },
})
export class AppComponent {
  private readonly facade = inject(UsersFacade);
  isLoggedIn = this.facade.isLoggedIn;
}
