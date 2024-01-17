import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, type OnInit } from '@angular/core';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameManagerService } from '../services/game-manager.service';
import { WordGeneratorService } from '../services/word-generator.service';
import Keyboard from '/Users/matteo/Desktop/web-dev/wordle/node_modules/simple-keyboard';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme-service.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    GameBoardComponent
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

  constructor(
    private wordGeneratorService: WordGeneratorService,
    private gameManagerService: GameManagerService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private themeService: ThemeService
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
      buttonTheme: [
        {
          class: "hg-red",
          buttons: "Q W E R T Y"
        }
      ],
      display: {
        '{enter}': 'enter',
        '{bksp}' : '<--'
      }
    });
  }

  ngOnInit(): void {
    this.wordGeneratorService.getRandomWord().subscribe((res) => {
      this.correctWord = res[0].toUpperCase();
      this.changeDetector.detectChanges();
      this.gameManagerService.setCorrectWord(this.correctWord);
      console.info('parola corretta: '+this.correctWord)
    })
    
    this.wordGeneratorService.getWordSet().subscribe((res) => {
      this.wordSet = res;
    })

    this.gameManagerService.rowChange.subscribe(value => {
      this.userInput = '';
    })

    this.gameManagerService.resultChange.subscribe(value => {
      console.info(value);
      this.result = value;
    })

    this.themeService.modeChange.subscribe(value => {
      this.mode = value;

      this.keyboard!.dispatch(instance => {
        instance.setOptions({
          theme: this.mode === 'light' ?  "hg-theme-default hg-layout-default myLightTheme" : "hg-theme-default hg-layout-default myDarkTheme"
        });
      });
      this.changeDetector.detectChanges();
    })

  }

  // DISPLAY KEYBOARD MANAGEMENT

  onChange = (input: string) => {
    console.info(input);
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
    // Funziona ma deprecato
    console.info(this.keyboard?.input);
    if(this.userInput.length>0) {
      this.keyboard!.input['default'] = this.keyboard!.input['default'].slice(0,-1);
      this.userInput = this.userInput.slice(0,-1);
      this.gameManagerService.updateInput(this.userInput);
    } else {
      this.keyboard!.input['default'] = '';
    }
  }

  restartGame() {
    this.gameManagerService.rowChange
    this.result = undefined;
    this.ngOnInit();
  }

  exit() {
    this.router.navigateByUrl('/home');
  }

}
