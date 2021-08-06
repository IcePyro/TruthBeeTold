import React from 'react';
import {user} from '../session/User';
import {observer} from 'mobx-react';
import {StateComponent} from '../StateModel';
import {LastWinView} from '../components/LastWinView';
import {game} from '../game/Game';
import {UsersHaveArticleView} from '../components/UsersHaveArticleView';
import {findMe} from '../game/CommonUser';
import {without} from 'lodash';
import {wiki, WikiOptions} from 'wiki';
import {action, makeAutoObservable, observable} from 'mobx';

import '../styles/wiki.sass';

const wikiOptions: WikiOptions = {
  domain: 'wikipedia.org',
  lang: 'de',
  ns: 0
};

class ArticleSelectModel {
  constructor() { makeAutoObservable(this); }

  @observable articleHtml = '<div></div>';
  @action setArticleHtml(html: string) { this.articleHtml = html; }
}

@observer
export default class ArticleSelect extends StateComponent {
  private model = new ArticleSelectModel();

  public componentDidMount() {
    user.socket.on('lockedstatus', (users: Array<{userid: number, hasArticle: boolean}>) => {
      const me = findMe(users);

      // Error handling
      if (!me) return console.error('Could not find me in locked status');
      if (me.hasArticle !== game.ownUser.hasArticle()) console.error('Server data does not match client: has article is out of sync (not syncing automatically)');

      for (const otherData of without(users, me)) {
        const other = game.otherUsers.getUserWithId(otherData.userid);
        if (!other) return console.error(`Could not find other user with id ${otherData.userid}`);

        // Update fields
        other.setHasArticle(otherData.hasArticle);
      }
    });
  }

  private selectArticle() {
    const input = document.getElementById('article-select') as HTMLInputElement;
    if (input.value) {
      user.socket.emit('lockinarticle', input.value);
    }
  }

  private async randomArticle() {
    const w = wiki(wikiOptions);
    const page = await w.randomPage();
    (document.getElementById('article-select') as HTMLInputElement).value = page.title;
    const html = await w.pageHTML(page.id);
    this.model.setArticleHtml(html);
  }

  render() {
    return (<div style={this.props.stateModel.enabledStyle}>
      <LastWinView />
      <h1>Select Article</h1>
      <input type='text' id='article-select'/>
      <button onClick={() => this.selectArticle()}>Submit</button>
      <button onClick={() => this.randomArticle()}>Random Article</button>
      <UsersHaveArticleView />
      <div dangerouslySetInnerHTML={{__html: this.model.articleHtml}}/>
    </div>);
  }
}
