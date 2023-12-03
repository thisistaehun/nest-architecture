import { Injectable } from '@nestjs/common';

@Injectable()
export class ShufflePostUsecase {
  constructor() {}

  public async execute(text: string, keywords: string[]) {
    const words: string[] = text.split(' ');
    words.push(...keywords);
    const shuffledWords = this.shuffle(words);
    return shuffledWords.join(' ');
  }

  private shuffle(array: string[]) {
    let currentIndex = array.length;
    let temporaryValue: string;
    let randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
