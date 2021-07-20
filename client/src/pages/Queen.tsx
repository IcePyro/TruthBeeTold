import React from 'react';
import PageModel from './PageModel';
import {observer} from 'mobx-react';
import {user} from '../session/User';
import {action, makeAutoObservable, observable} from 'mobx';

class QueenModel {
  constructor() {makeAutoObservable(this);}

  @observable players: number[] = [];

  @action setPlayers(players: number[]) {
    this.players = players;
  }
}

export interface QueenProps {
  page: PageModel;
}

@observer
export default class Queen extends React.Component<QueenProps> {
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
    const players = this.model.players.map(player => <input type='radio' className='player-selection' name='players' value={player}/>);
    return (<div style={this.props.page.enabledStyle}>
      <h1>Yas Queen</h1>
      {players}
      <button onClick={() => this.selectPlayer()}>Submit</button>
    </div>);
  }
}
