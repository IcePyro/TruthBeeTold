import './styles/app.sass';
import React from 'react';
import Home from './pages/Home';
import {ClearSession} from './components/ClearSession';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import {action, computed, makeAutoObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import PageModel, {Page, PageCalls} from './pages/PageModel';
import Settings from './pages/Settings';
import {user} from './session/User';
import ArticleSelect from './pages/ArticleSelect';
import Queen from './pages/Queen';
import BeeAndWasp from './pages/BeeAndWasp';
import Wait from './pages/Wait';

class AppModel {
  constructor() {makeAutoObservable(this);}

  @observable room: Page = Page.Home;
  lastEvent: any;

  pages: PageModel[] = [  // TODO no 🤢
    new PageModel(),
    new PageModel(),
    new PageModel(),
    new PageModel(),
    new PageModel(),
    new PageModel(),
    new PageModel(),
    new PageModel(),
  ];

  @action switchPage(nextPage: Page) {
    console.log(`Switching from page ${this.room} to page ${nextPage}`);
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

    user.socket.on('statetransition', (state: number) => {
      this.model.switchPage(PageCalls[state]);
    });

    // TODO remove
    user.socket.on('beecorrect', () => alert('beecorrect'));
    user.socket.on('beefalse', () => alert('beefalse'));
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
        <ArticleSelect page={this.model.pages[Page.ArticleSelect]}/>
        <Queen page={this.model.pages[Page.Queen]}/>
        <BeeAndWasp page={this.model.pages[Page.BeeAndWasp]}/>
        <Wait page={this.model.pages[Page.Wait]}/>
        <ClearSession />
      </>
    );
  }
}
