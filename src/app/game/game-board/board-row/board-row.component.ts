import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { BoardUnitComponent } from '../board-unit/board-unit.component';
import { GameManagerService } from 'src/app/services/game-manager.service';

@Component({
  selector: 'app-board-row',
  standalone: true,
  imports: [
    CommonModule,
    BoardUnitComponent
  ],
  templateUrl: './board-row.component.html',
  styleUrls: ['./board-row.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BoardRowComponent implements OnInit {

  @Input() mode: string = 'light';
  @Input() correctWord: string = '';
  @Input() index?: number;

  shake: string = '';
  userInput: string = '';
  currentRow: any = 0;

  auxWord = '     '
  word = this.auxWord.split('');

  constructor(private gameManagerService: GameManagerService) {}

  ngOnInit(): void { 
    // Subscribe to changes of user input
    this.gameManagerService.userInputChange.subscribe(value => {
      this.userInput = value;
      for(var i = 0; i < value.length; i++) {
        this.word[i] = value.split('')[i]; 
      }
    })
    // Subscribe to changes of row
    this.gameManagerService.rowChange.subscribe(value => {
      this.currentRow = value;
    })
    
  }

}
