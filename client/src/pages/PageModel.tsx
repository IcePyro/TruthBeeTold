import {action, computed, makeAutoObservable, observable} from 'mobx';

export enum Page { Home, Settings, Lobby, Game, ArticleSelect, BeeAndWasp, Queen, Wait}

export const PageCalls: {[key: number]: number} = {
  0: Page.Home,
  1: Page.Settings,
  2: Page.Lobby,
  100: Page.Game,
  3: Page.ArticleSelect,
  4: Page.BeeAndWasp,
  5: Page.BeeAndWasp,
  6: Page.Queen,
  7: Page.Wait,
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
