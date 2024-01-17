import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from '../game/game.component';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme-service.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    GameComponent,
  ],
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit { 
  mode ='light';
  rules = false;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.themeService.modeChange.subscribe(value => {
      this.mode = value;
      console.info(this.mode)
      this.changeDetector.detectChanges();
    }) 
  }

  startGame() {
    this.router.navigateByUrl('/game');
  }

  toggleMode() {
    if(this.mode === 'light') {
      this.mode = 'dark';
    }
    else {
      this.mode = 'light'
    }
  }

  openRules() {
    this.rules = true;
  }

  closeRules() {
    this.rules = false;
  }
}
