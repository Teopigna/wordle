import { Injectable } from '@angular/core';
import { Subject, delay } from 'rxjs';
import { WordGeneratorService } from './word-generator.service';
import { StatsService } from './stats-service.service';

// Service that manage most of game functionalities
@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  userInput: string = '';
  currentRow = 0;
  correctWord :any;
  wordSet: any;
  wordGuess: any;

  handlerTimeout_1: any;
  handlerTimeout_2: any;

  // Subjects for dinamic changes in components
  userInputChange: Subject<string> = new Subject<string>();
  guessSent: Subject<string> = new Subject<string>();
  rowChange: Subject<number> = new Subject<number>();
  resultChange: Subject<string> = new Subject<string>();
  alertChange: Subject<string> = new Subject<string>();
  restartChange: Subject<boolean> = new Subject<boolean>();
  // Subjects for keyboard coloring used letters
  correctLetter: Subject<string> = new Subject<string>();
  containedLetter: Subject<string> = new Subject<string>();
  normalLetter: Subject<string> = new Subject<string>();

  constructor(private wordGeneratorService: WordGeneratorService, private statsService: StatsService)  {
    this.userInputChange.subscribe((value) => {
        this.userInput = value;
    });
    this.guessSent.subscribe((value) => {
      this.wordGuess = value;
    })
    this.wordGeneratorService.getWordSet().subscribe((res) => {
      this.wordSet = res;
    })
  }

  updateInput(input: string) {
    this.userInputChange.next(input.toLowerCase());
  }

  setCorrectWord(value: string) {
    this.correctWord = value;
  }

  increaseCurrentRow() {
    if(this.currentRow < 6) {
      this.currentRow+=1;
      this.rowChange.next(this.currentRow);
      if(this.currentRow >= 6) {
        return;
      } 
    } 
  }

  getCurrentRow(){
    return this.currentRow;
  }

  sendGuess(guess:string) {
    if(guess.length<5) {
      this.alertChange.next('La parola è troppo corta');
      clearTimeout(this.handlerTimeout_1);
      this.handlerTimeout_1 = setTimeout(() => {
        this.resetAlert();
      }, 1500);
      return;
    }
    if(!this.wordSet.includes(guess.toLowerCase())) {
      this.alertChange.next('La parola non è valida');
      clearTimeout(this.handlerTimeout_2);
      this.handlerTimeout_2 = setTimeout(() => {
        this.resetAlert();
      }, 1500);
      return;
    }
    if(guess.toUpperCase() === this.correctWord) {
      this.rowChange.next(this.currentRow);
      this.winGame();
      
    }
    if(guess.toUpperCase() != this.correctWord && this.currentRow === 5) {
      this.rowChange.next(this.currentRow);
      this.looseGame();
    }
    this.guessSent.next(guess.toUpperCase());
    this.increaseCurrentRow();
  }
  
  sendCorrectLetter(letter: string) {
    this.correctLetter.next(letter);
  }

  sendContainedLetter(letter: string) {
    this.containedLetter.next(letter);
  }

  sendNormalLetter(letter: string) {
    this.normalLetter.next(letter);
  }

  winGame() {
    this.statsService.addResult('win', this.currentRow);
    this.currentRow = -1;
    this.resultChange.next('vinto');
  }

  looseGame() {
    this.statsService.addResult('loss', this.currentRow);
    this.currentRow = -1;
    this.resultChange.next('perso');
  }

  resetAlert() {
    this.alertChange.next('');
  }

}
