import React from 'react';
import {observer} from 'mobx-react';
import {user} from '../session/User';
import ArticleView from '../components/ArticleView';
import {StateComponent} from '../StateModel';
import {game} from '../game/Game';
import {Page} from '../components/Page';

@observer
export default class Queen extends StateComponent {

  private selectPlayer() {
    const players = Array.from(document.querySelectorAll('.player-selection')) as HTMLInputElement[];
    const selectedPlayer = Number(players.find(p => p.checked)?.value);
    if (selectedPlayer !== null && !Number.isNaN(selectedPlayer)) {
      user.socket.emit('beeselect', selectedPlayer);
    }
  }

  render() {
    const players = game.otherUsers.users.map((user, index) => (
      <div key={index}>
        <span>{user.username}: </span>
        <input type='radio' className='player-selection' name='players' value={user.id}/>
      </div>
    ));

    return (<Page enabled={this.props.stateModel.enabled}
      startOfPage={
        <>
          <h1>Yas Queen</h1>
          <ArticleView />
          {players}
        </>
      } endOfPage={
        <>
          <button onClick={() => this.selectPlayer()}>Submit</button>
        </>
      } />);
  }
}
