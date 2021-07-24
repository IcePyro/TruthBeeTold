import React from 'react';
import {observer} from 'mobx-react';
import {user} from '../session/User';
import ArticleView from '../components/ArticleView';
import {StateComponent} from '../StateModel';
import {otherUsers} from '../game/OtherUser';

@observer
export default class Queen extends StateComponent {

  private selectPlayer() {
    const players = Array.from(document.querySelectorAll('.player-selection')) as HTMLInputElement[];
    const selectedPlayer = players.find(p => p.checked)?.value;
    if (selectedPlayer !== null) {
      user.socket.emit('beeselect', selectedPlayer);
    }
  }

  render() {
    const players = otherUsers.users.map((user, index) => (
      <div key={index}>
        <span>{user.username}: </span>
        <input type='radio' className='player-selection' name='players' value={user.id}/>
      </div>
    ));
    return (<div style={this.props.stateModel.enabledStyle}>
      <h1>Yas Queen</h1>
      <ArticleView />
      {players}
      <button onClick={() => this.selectPlayer()}>Submit</button>
    </div>);
  }
}
