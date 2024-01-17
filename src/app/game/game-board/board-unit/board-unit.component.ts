import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, type OnInit } from '@angular/core';
import { GameManagerService } from 'src/app/services/game-manager.service';

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
  @Input() mode: string = 'light';
  @Input() correctWord: string = '';
  @Input() rowIndex?: number;
  @Input() index?: number;

  type: string = 'normal' // or right / or contained
  inputLetter:string = '';
  currentRow:number = 0;
  correctLetter?: string;

  constructor(private gameManagerService: GameManagerService, private changeDetector: ChangeDetectorRef) {}


  ngOnInit(): void {
    //Get current row
    this.currentRow = this.gameManagerService.getCurrentRow();

    this.gameManagerService.rowChange.subscribe(value => {
      this.currentRow = value;
      this.changeDetector.detectChanges();
    })

    this.gameManagerService.userInputChange.subscribe(value => {
      if(this.currentRow === this.rowIndex) {
        
        if(value.length < this.index!+1) {
          this.inputLetter='';
        }
        else {
          this.inputLetter = value.split('')[this.index!].toUpperCase();
        }
      }
      this.changeDetector.detectChanges();
    })

    this.gameManagerService.guessSent.subscribe(value => {
      var currentGuess = value.split('')[this.index!];
      
      if(this.currentRow === this.rowIndex) {
        if( currentGuess === this.correctWord.split('')[this.index!]) {
          this.type = 'correct';
        } else if(this.correctWord.split('').includes(currentGuess)) {
          this.type = 'contained'
        } else {
          // console.info('normal');
        }
      }
      
      this.changeDetector.detectChanges();
    })
  }

}
