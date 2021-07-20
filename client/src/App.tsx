import './styles/app.sass';
import React from 'react';
import Home from './pages/Home';
import {ClearSession} from './components/ClearSession';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import {action, computed, makeAutoObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import PageModel, {Page} from './pages/PageModel';
import Settings from './pages/Settings';

class AppModel {
  constructor() { makeAutoObservable(this); }

  @observable room: Page = Page.Home;
  lastEvent: any;

  pages: PageModel[] = [
    new PageModel(),
    new PageModel(),
    new PageModel(),
    new PageModel(),
  ];

  @action switchPage(nextPage: Page) {
    this.currentModel.setEnabled(false);
    this.room = nextPage;
    this.currentModel.setEnabled(true);
  }

  @computed get currentModel(): PageModel {
    return this.pages[this.room];
  }
}

@observer
export default class App extends React.Component {
  private model = new AppModel();

  constructor(props: any) {
    super(props);
    this.model.pages.forEach(page => page.onNextPage = (page, event) => this.onNextPage(page, event));
    this.model.pages[Page.Home].setEnabled(true);
  }

  private onNextPage(page: Page, event: any) {
    this.model.lastEvent = event;
    console.log(`Switching to page ${page}`);
    this.model.switchPage(page);
  }

  render(): React.ReactNode {
    return (
      <>
        <Home page={this.model.pages[Page.Home]}/>
        <Settings page={this.model.pages[Page.Settings]}/>
        <Lobby page={this.model.pages[Page.Lobby]}/>
        <Game page={this.model.pages[Page.Game]}/>
        <ClearSession />
      </>
    );
  }
}
