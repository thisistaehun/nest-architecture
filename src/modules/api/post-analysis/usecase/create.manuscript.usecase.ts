import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateManuscriptUsecase {
  constructor() {}

  public async execute(text: string, keywords: string[]) {
    const words: string[] = text.split(' ');
    const result = this.insertKeywordToWords(words, keywords);
    return result.join(' ');
  }

  private insertKeywordToWords(words: string[], keywords: string[]) {
    const result = [...words];
    for (const keyword of keywords) {
      const randomIndex = Math.floor(Math.random() * result.length);
      result.splice(randomIndex, 0, keyword);
    }
    return result;
  }
}
