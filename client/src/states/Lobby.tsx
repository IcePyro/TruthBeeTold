import {action, makeAutoObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import {user} from '../session/User';
import {StateComponent} from '../StateModel';

class LobbyModel {
  constructor() { makeAutoObservable(this); }

  @observable id = -1;
  @observable lobbyId = '';

  @action setIdAndLobbyId(id: number, lobbyId: string) {
    this.id = id;
    this.lobbyId = lobbyId;
  }
}

@observer
export default class Lobby extends StateComponent {
  private model = new LobbyModel();

  constructor(props: any) {
    super(props);
    user.socket.on('youridandlobby', ({id, lobbyId}: {id: number, lobbyId: string}) => {
      this.model.setIdAndLobbyId(id, lobbyId);
    });
  }

  private onToggleReady() {
    user.socket.emit('toggleready');
  }

  render(): React.ReactNode {
    return (<div style={this.props.stateModel.enabledStyle}>
      <h1>Lobby</h1>
      <h2>Your id: {this.model.id}</h2>
      <h2>Your Lobby: {this.model.lobbyId}</h2>
      <input type='checkbox' onChange={() => this.onToggleReady()}/>
    </div>);
  }
}
