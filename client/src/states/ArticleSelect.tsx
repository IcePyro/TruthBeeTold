import React from 'react';
import {user} from '../session/User';
import {observer} from 'mobx-react';
import {StateComponent} from '../StateModel';
import {LastWinView} from '../components/LastWinView';
import {game} from '../game/Game';
import {UsersHaveArticleView} from '../components/UsersHaveArticleView';
import {findMe} from '../game/CommonUser';
import {without} from 'lodash';

@observer
export default class ArticleSelect extends StateComponent {
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

  render() {
    return (<div style={this.props.stateModel.enabledStyle}>
      <LastWinView />
      <h1>Select Article</h1>
      <input type='text' id='article-select'/>
      <button onClick={() => this.selectArticle()}>Submit</button>
      <UsersHaveArticleView />
    </div>);
  }
}
