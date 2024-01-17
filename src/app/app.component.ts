import { Component } from '@angular/core';
import { ThemeService } from './services/theme-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'wordle';
    mode = 'light';

    constructor(private themeService: ThemeService) {
      this.themeService.modeChange.subscribe(value => {
        this.mode = value;
      })
    }

    toggleMode() {
      this.themeService.toggleMode();
    }
}
