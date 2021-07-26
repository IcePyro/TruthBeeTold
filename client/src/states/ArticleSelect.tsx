import React from 'react';
import {user} from '../session/User';
import {observer} from 'mobx-react';
import {StateComponent} from '../StateModel';
import {LastWinView} from '../components/LastWinView';
import {game} from '../game/Game';
import {UsersHaveArticleView} from '../components/UsersHaveArticleView';

@observer
export default class ArticleSelect extends StateComponent {
  public componentDidMount() {
    user.socket.on('lockedinarticle', (userId: number) => {
      const user = game.otherUsers.getUserWithId(userId);
      if (user) user.setHasArticle(true);
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
