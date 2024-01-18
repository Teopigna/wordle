import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { GameManagerService } from './services/game-manager.service';
import { WordGeneratorService } from './services/word-generator.service';
import { HttpClientModule } from '@angular/common/http';
import { ThemeService } from './services/theme-service.service';
import { NgChartsModule } from 'ng2-charts';
import { StatsComponent } from './stats/stats.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeComponent,
    GameComponent,
    HttpClientModule,
    NgChartsModule,
    StatsComponent
  ],
  providers: [
    GameManagerService, WordGeneratorService, ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
