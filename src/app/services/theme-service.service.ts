import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  mode: string = 'light';

  modeChange: Subject<string> = new Subject<string>();

  constructor() { 
    // this.themeChange.subscribe(value => {
    //   this.theme = value;
    // })
  }

  toggleMode() {
    if(this.mode === 'light') {
      this.mode = 'dark';
      this.modeChange.next(this.mode);
    } else {
      this.mode = 'light';
      this.modeChange.next(this.mode);
    }
  }


}
