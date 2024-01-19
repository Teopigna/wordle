import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WordGeneratorService {
  urlCorrect = 'https://random-word-api.herokuapp.com/word?length=5&lang=en';
  urlSet = 'https://random-word-api.herokuapp.com/word?number=10000&length=5';

  constructor(private http: HttpClient) {
   
  }
  // Get a random 5-letter english word
  getRandomWord() {
    return this.http.get<any>(this.urlCorrect);
  }
  // Get a set of 5-letters words
  getWordSet() {
    return this.http.get<any>(this.urlSet);
  }
  
}
