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
  // Subjects for keyboard coloring used letters
  correctLetter: Subject<string> = new Subject<string>();
  containedLetter: Subject<string> = new Subject<string>();
  normalLetter: Subject<string> = new Subject<string>();

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
    if(guess.toUpperCase() === this.correctWord) {
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

  sendCorrectLetter(letter: string) {
    console.info('correct: '+letter);
    this.correctLetter.next(letter);
  }

  sendContainedLetter(letter: string) {
    console.info('contained: '+letter);
    this.containedLetter.next(letter);
  }

  sendNormalLetter(letter: string) {
    console.info('normal: '+letter);
    this.normalLetter.next(letter);
  }

  winGame() {
    this.resultChange.next('vinto');
  }

  looseGame() {
    this.resultChange.next('perso');
  }
}
