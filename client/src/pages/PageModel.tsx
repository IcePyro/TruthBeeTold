import {action, computed, makeAutoObservable, observable} from 'mobx';

export enum Page { Home, Settings, Lobby, Game, ArticleSelect, BeeAndWasp, Queen, Wait}

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
