import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, type OnInit } from '@angular/core';
import { GameManagerService } from 'src/app/services/game-manager.service';
import { ThemeService } from 'src/app/services/theme-service.service';

@Component({
  selector: 'app-board-unit',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './board-unit.component.html',
  styleUrls: ['./board-unit.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BoardUnitComponent implements OnInit {
  @Input() correctWord: string = '';
  @Input() rowIndex?: number;
  @Input() index?: number;

  type: string = 'normal' // or correct / or contained
  inputLetter:string = '';
  currentRow:number = 0;
  correctLetter?: string;
  mode: string = 'light';
  isInput: string = '';

  restartChangeSub: any;
  rowChangeSub: any;
  inputChangeSub: any;
  guessSentSub: any;
  modeChangeSub: any;

  constructor(
    private gameManagerService: GameManagerService, 
    private changeDetector: ChangeDetectorRef, 
    private themeService: ThemeService
  ) {

    }


  ngOnInit(): void {
    // Get theme
    this.mode = this.themeService.getMode();
    //Get current row
    this.currentRow = this.gameManagerService.getCurrentRow();
    // Subscribe to game restarting routine -> reinitialize
    this.restartChangeSub = this.gameManagerService.restartChange.subscribe(res => {
      this.inputLetter='';
      this.type='normal';
    })
    // Subscribe to row changes
    this.rowChangeSub = this.gameManagerService.rowChange.subscribe(value => {
      this.currentRow = value;
      this.changeDetector.detectChanges();
    })
    // Subscribe to input changes
    this.inputChangeSub = this.gameManagerService.userInputChange.subscribe(value => {
      if(this.currentRow === this.rowIndex) {
        if(value.length < this.index!+1) {
          this.inputLetter='';
          this.isInput = ''
        }
        else {
          this.inputLetter = value.split('')[this.index!].toUpperCase();
          this.isInput = 'is-input'
        }
      }
      this.changeDetector.detectChanges();
    })
    // Subscribe to guess sent signal
    this.guessSentSub = this.gameManagerService.guessSent.subscribe(value => {
      var currentGuess = value.split('')[this.index!];
      
      if(this.currentRow === this.rowIndex) {
        if( currentGuess === this.correctWord.split('')[this.index!]) {
          this.type = 'correct';
          this.gameManagerService.sendCorrectLetter(this.inputLetter);
        } else if(this.correctWord.split('').includes(currentGuess)) {
          this.type = 'contained'
          this.gameManagerService.sendContainedLetter(this.inputLetter);
        } else {
          this.gameManagerService.sendNormalLetter(this.inputLetter);
        }
      }
        
      this.changeDetector.detectChanges();
    })
    // Subscribe to theme mode changes
    this.modeChangeSub = this.themeService.modeChange.subscribe(value => {
      this.mode = value;
      this.changeDetector.detectChanges();
    })
  }
  // Clean component before reinitializing
  ngOnDestroy() {
    this.guessSentSub.unsubscribe();
    this.rowChangeSub.unsubscribe();
    this.modeChangeSub.unsubscribe();
    this.inputChangeSub.unsubscribe();
    this.restartChangeSub.unsubscribe();
  }

}
