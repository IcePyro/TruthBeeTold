import {action, computed, makeAutoObservable, observable} from 'mobx';

export interface Win {
  queenId: number;
  beeId: number;
  selectedId: number;
  articleId?: string;
  correct: boolean;
}

export default class Wins {
  constructor() { makeAutoObservable(this); }

  @observable wins: Win[] = [];

  @computed get last(): Win | undefined {
    return this.wins.length > 0 ? this.wins[this.wins.length - 1] : undefined;
  }

  @action addWin(win: Win) {
    this.wins.push(win);
  }

  @action reset() {
    this.wins = [];
  }
}
