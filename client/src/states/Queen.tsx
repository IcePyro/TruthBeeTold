import React from 'react';
import {observer} from 'mobx-react';
import {user} from '../session/User';
import {action, makeAutoObservable, observable} from 'mobx';
import ArticleView from '../components/ArticleView';
import {StateComponent} from '../StateModel';

class QueenModel {
  constructor() {makeAutoObservable(this);}

  @observable players: number[] = [];

  @action setPlayers(players: number[]) {
    this.players = players;
  }
}

@observer
export default class Queen extends StateComponent {
  private model = new QueenModel();

  constructor(props: any) {
    super(props);

    user.socket.on('playerlist', (players: number[]) => {
      this.model.setPlayers(players);
    });
  }

  private selectPlayer() {
    const players = Array.from(document.querySelectorAll('.player-selection')) as HTMLInputElement[];
    const selectedPlayer = players.find(p => p.checked)?.value;
    if (selectedPlayer !== null) {
      user.socket.emit('beeselect', selectedPlayer);
    }
  }

  render() {
    const players = this.model.players.map(player => (
      <div key={player}>
        <span>{player}: </span>
        <input type='radio' className='player-selection' name='players' value={player}/>
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
