import { Component } from '@angular/core';
import { ThemeService } from './services/theme-service.service';
import { StatsComponent } from './stats/stats.component';
import { StatsService } from './services/stats-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'wordle';
    mode = 'light';
    stats = false;
    statsLocked = false;

    constructor(private themeService: ThemeService, private statsService: StatsService) {
      this.themeService.modeChange.subscribe(value => {
        this.mode = value;
      })
      this.statsService.statsLocked.subscribe(value => {
        this.statsLocked = value;
      })
    }

    toggleMode() {
      this.themeService.toggleMode();
    }

    toggleStats() {
      if(!this.statsLocked) {
        this.stats = !this.stats;
      }
    }

    closeStats() {
      this.stats = false;
    }

    
}
