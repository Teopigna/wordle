import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WordGeneratorService } from './word-generator.service';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  userInput: string = '';
  currentRow = 0;
  correctWord :any;
  wordSet: any;
  wordGuess: any;

  userInputChange: Subject<string> = new Subject<string>();
  guessSent: Subject<string> = new Subject<string>();
  rowChange: Subject<number> = new Subject<number>();
  resultChange: Subject<string> = new Subject<string>();

  constructor(private wordGeneratorService: WordGeneratorService)  {
    this.userInputChange.subscribe((value) => {
        this.userInput = value;
    });
    this.guessSent.subscribe((value) => {
      this.wordGuess = value;
    })
    // this.wordGeneratorService.getRandomWord().subscribe((res) => {
    //   this.correctWord = res[0]
    // })
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
      console.info('Word is too short')
      return;
    }
    if(!this.wordSet.includes(guess.toLowerCase())) {
      console.info('Word is not recognized');
      return;
    }
    console.info('is: '+ guess.toUpperCase()+' = '+this.correctWord)
    if(guess.toUpperCase() === this.correctWord) {
      console.info('game-won');
      this.currentRow = -1;
      this.rowChange.next(this.currentRow);
      this.winGame();
      
    }
    if(guess.toUpperCase() != this.correctWord && this.currentRow === 5) {
      this.currentRow = -1;
      this.rowChange.next(this.currentRow);
      this.looseGame();
    }
    this.guessSent.next(guess.toUpperCase());
    this.increaseCurrentRow();
  }

  winGame() {
    this.resultChange.next('win');
  }

  looseGame() {
    this.resultChange.next('loose');
  }
}
