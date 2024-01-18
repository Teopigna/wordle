import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, type OnInit } from '@angular/core';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameManagerService } from '../services/game-manager.service';
import { WordGeneratorService } from '../services/word-generator.service';
import Keyboard from '/Users/matteo/Desktop/web-dev/wordle/node_modules/simple-keyboard';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme-service.service';
import { StatsComponent } from '../stats/stats.component';
import { StatsService } from '../services/stats-service.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    GameBoardComponent,
    StatsComponent
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {

  mode = 'light';
  userInput ='';
  correctWord: any;
  wordSet: any;
  result?: string;

  // value?: string;
  keyboard?: Keyboard;
  alertMessage: string = '';

  constructor(
    private wordGeneratorService: WordGeneratorService,
    private gameManagerService: GameManagerService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private themeService: ThemeService,
    private statsService: StatsService
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit():void {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      theme: this.mode === 'light' ?  "hg-theme-default hg-layout-default myLightTheme" : "hg-theme-default hg-layout-default myDarkTheme",
      layout: {
        'default': [
          'Q W E R T Y {bksp}',
          'U I O P A S D',
          'F G H J K L {enter}',
          'Z X C V B N M',
        ]
      },
      display: {
        '{enter}': 'enter',
        '{bksp}' : '<--'
      },
    });
  }

  ngOnInit(): void {
    
    this.mode = this.themeService.getMode();
    this.wordGeneratorService.getRandomWord().subscribe((res) => {
      this.correctWord = res[0].toUpperCase();
      console.info('correctWord: '+this.correctWord)
      this.changeDetector.detectChanges();
      this.gameManagerService.setCorrectWord(this.correctWord);
    })

    this.wordGeneratorService.getWordSet().subscribe((res) => {
      this.wordSet = res;
    })

    this.gameManagerService.rowChange.subscribe(value => {
      this.userInput = '';
    })

    this.gameManagerService.resultChange.subscribe(value => {
      this.result = value;
      this.statsService.statsLocked.next(true);
    })

    this.gameManagerService.correctLetter.subscribe(value => {
      this.keyboard?.removeButtonTheme(value, 'hg-contained');
      this.keyboard?.addButtonTheme(value, 'hg-correct');
      this.changeDetector.detectChanges();
    })
    this.gameManagerService.containedLetter.subscribe(value => {
      if(this.keyboard?.getButtonThemeClasses(value)[0] === 'hg-correct') {
        return;
      } else {
        this.keyboard?.addButtonTheme(value, 'hg-contained');
      }
      this.changeDetector.detectChanges();
    })
    this.gameManagerService.normalLetter.subscribe(value => {
      this.keyboard?.addButtonTheme(value, 'hg-normal');
      this.changeDetector.detectChanges();
    })
    this.gameManagerService.alertChange.subscribe(value => {
      this.alertMessage = value;
      this.changeDetector.detectChanges();
    })

    this.themeService.modeChange.subscribe(value => {
      this.mode = value;

      this.keyboard!.dispatch(instance => {
        instance.setOptions({
          theme: this.mode === 'light' ?  "hg-theme-default hg-layout-default myLightTheme" : "hg-theme-default hg-layout-default myDarkTheme",
        });
      });
      // TODO
      // this.keyboard?.addButtonTheme('L F D R H', 'hg-contained')
      this.changeDetector.detectChanges();
    })

  }

  // DISPLAY KEYBOARD MANAGEMENT

  onChange = (input: string) => {
    if(input.length > 1) {
      if(input[input.length-1].length > 0) {
        this.userInput+=input[input.length-1]
        this.gameManagerService.updateInput(this.userInput);
      } else {
        this.userInput+=input.slice(0,-1);
        this.gameManagerService.updateInput(this.userInput);
      }
    } else {
      this.userInput+=input;
      this.gameManagerService.updateInput(this.userInput);
    }
    
    
    console.log("Input changed", input);
  };

  onKeyPress = (button: string) => {
    if(button === '{bksp}') {
      if(this.userInput.length>0) {
        this.keyboard!.input['default'] = this.keyboard!.input['default'].slice(0,-1);
        this.userInput = this.userInput.slice(0,-1);
        this.gameManagerService.updateInput(this.userInput);
      } else {
        this.keyboard!.input['default'] = '';
      }
    }
    if(button === '{enter}') {
      this.gameManagerService.sendGuess(this.userInput);
    }
  };

  // onInputChange = (event: any) => {
  //   this.keyboard.setInput(event.target.value);
  // };

  // USER INPUT MANAGEMENT 

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Funziona ma deprecato
    if(event.keyCode >= 65 && event.keyCode <= 122 && this.userInput.length < 5) {
      this.keyboard!.input['default'] += event.key;
      this.userInput+=event.key;
      this.gameManagerService.updateInput(this.userInput);
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onDocumentKeydownEnter(event: KeyboardEvent) {
    this.gameManagerService.sendGuess(this.userInput);
  }

  @HostListener('document:keydown.backspace', ['$event'])
  onDocumentKeydownBackspace(event: KeyboardEvent) {
    if(this.userInput.length>0) {
      this.keyboard!.input['default'] = this.keyboard!.input['default'].slice(0,-1);
      this.userInput = this.userInput.slice(0,-1);
      this.gameManagerService.updateInput(this.userInput);
    } else {
      this.keyboard!.input['default'] = '';
    }
  }

  restartGame() {
    this.result = undefined;
    this.keyboard?.removeButtonTheme(
      'Q W E R T Y U I O P A S D F G H J K L Z X C V B N M',
      'hg-correct'
    );
    this.keyboard?.removeButtonTheme(
      'Q W E R T Y {bksp} U I O P A S D F G H J K L Z X C V B N M',
      'hg-contained'
    );
    this.keyboard?.removeButtonTheme(
      'Q W E R T Y {bksp} U I O P A S D F G H J K L Z X C V B N M',
      'hg-normal'
    );
    this.statsService.statsLocked.next(false);
    this.gameManagerService.restartChange.next(true);
    this.changeDetector.detectChanges();
    this.gameManagerService.userInputChange.next('');
    // Choose a new letter
    this.wordGeneratorService.getRandomWord().subscribe((res) => {
      this.correctWord = res[0].toUpperCase();
      console.info('correctWord: '+this.correctWord)
      this.changeDetector.detectChanges();
      this.gameManagerService.setCorrectWord(this.correctWord);
    })
  }

  exit() {
    this.statsService.statsLocked.next(false);
    this.router.navigateByUrl('/home');
  }

}
