import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { BoardRowComponent } from './board-row/board-row.component';
import { GameManagerService } from 'src/app/services/game-manager.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    CommonModule,
    BoardRowComponent
  ],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent implements OnInit {

  @Input() mode: string = 'light';
  @Input() correctWord: string = '';

  userInput: string = '';

  constructor(private gameManagerService: GameManagerService) {}

  ngOnInit(): void {
    this.gameManagerService.userInputChange.subscribe(value => {
      this.userInput = value;
    })
  }


}
