import {action, computed, makeAutoObservable, observable} from 'mobx';

export enum Page { Home, Settings, Lobby, Game, ArticleSelect, BeeAndWasp, Queen, Wait}

export const PageCalls: {[key: number]: number} = {
  10: Page.Home,
  14: Page.Settings,
  12: Page.Lobby,
  101: Page.Game,
  0: Page.ArticleSelect,
  2: Page.BeeAndWasp,
  3: Page.BeeAndWasp,
  1: Page.Queen,
  4: Page.Wait,
};

export default class PageModel {
  constructor() { makeAutoObservable(this); }

  onNextPage: (next: Page, event?: any) => void = () => { return; };
  @observable enabled = false;

  @action setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  @computed get enabledStyle() {
    return {display: this.enabled ? 'block' : 'none'};
  }
}
