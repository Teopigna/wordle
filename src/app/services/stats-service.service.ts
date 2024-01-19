import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

// Stat object interface
export interface Stats {
  gamesPlayed: number;
  wins: number;
  loss:number;
  currentStreak: number;
  distribution: number[];
  dist: number[];
}
// Service that manages collecting and storing stats
@Injectable({
  providedIn: 'root'
})
export class StatsService {

  stats: Stats = {
    gamesPlayed: 0,
    wins: 0,
    loss: 0,
    currentStreak: 0,
    distribution: [],
    dist: [0,0,0,0,0,0]
  };

  gamesPlayed: number = 0;
  wins: number = 0;
  loss: number = 0;
  currentStreak: number = 0;
  distribution: number[] = [];

  dist = [0,0,0,0,0,0];

  statsChange: Subject<Stats> = new Subject<Stats>();
  statsLocked: Subject<boolean> = new Subject<boolean>();

  constructor() { 
    // Check and initialize (if needed) local storage
    if(!localStorage.getItem('games-played')) {
      localStorage.setItem('games-played', '0');
    }
    if(!localStorage.getItem('wins')) {
      localStorage.setItem('wins', '0');
    }
    if(!localStorage.getItem('loss')) {
      localStorage.setItem('loss', '0');
    }
    if(!localStorage.getItem('games-played')) {
      localStorage.setItem('curremtStreak','0');
    }
    if(!localStorage.getItem('distribution')) {
      localStorage.setItem('distribution','');
    }
    if(!localStorage.getItem('dist')) {
      localStorage.setItem('dist', '0,0,0,0,0,0');
    }
    this.gamesPlayed = +localStorage!.getItem('games-played')!;
    this.wins = +localStorage!.getItem('wins')!;
    this.loss = +localStorage!.getItem('loss')!;
    this.currentStreak = +localStorage!.getItem('currentStreak')!;
    var stringDistribution = localStorage.getItem('distribution')!.split(',');
    if(stringDistribution.length === 1) {
      this.distribution = [];
    } else {
      this.distribution = stringDistribution.map(el => +el);
    }
    var aux = localStorage.getItem('dist');
    this.dist = aux!.split(',').map(Number);

    this.stats = {
      gamesPlayed: this.gamesPlayed,
      wins: this.wins,
      loss: this.loss,
      currentStreak: this.currentStreak,
      distribution: this.distribution,
      dist: this.dist
    }
  }

  addResult(result: string, guesses: number) {
      this.gamesPlayed +=1;
      if(result==='win') {
        this.wins +=1 ;
        this.currentStreak +=1;
        this.distribution.push(guesses);
        this.dist[guesses] +=1;
      }
      if(result === 'loss') {
        this.loss +=1;
        this.currentStreak = 0;
      }
      this.stats = {
        gamesPlayed: this.gamesPlayed,
        wins: this.wins,
        loss: this.loss,
        currentStreak: this.currentStreak,
        distribution: this.distribution,
        dist:this.dist
      }
      this.statsChange.next(this.stats);
      localStorage.setItem('games-played', this.gamesPlayed.toString());
      localStorage.setItem('wins', this.wins.toString());
      localStorage.setItem('loss', this.loss.toString());
      localStorage.setItem('currentStreak', this.currentStreak.toString());
      localStorage.setItem('distribution', this.distribution.toString());
      localStorage.setItem('dist', this.dist.toString());

  }

  getStats(): Stats {
    return this.stats!;
  }

}
