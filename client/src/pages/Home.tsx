import React from 'react';
import '../styles/home.sass';
import {user} from '../session/User';
import {observer} from 'mobx-react';
import {action, computed, makeAutoObservable, observable} from 'mobx';

class HomeModel {
  constructor() {makeAutoObservable(this);}

  @observable lobbyId?: string;

  @action setLobbyId(lobbyId: string) {
    this.lobbyId = lobbyId;
  }

  @computed get hasLobbyId(): boolean {
    return !!this.lobbyId;
  }
}

@observer
export default class Home extends React.Component {
  private model = new HomeModel();

  public constructor(props: any) {
    super(props);

    const lobbyId = location.hash.substr(1);
    if (lobbyId) this.model.setLobbyId(lobbyId);
  }

  private onCreateLobby() {
    user.socket.emit('createlobby');
  }

  private onJoinLobby() {
    if (this.model.hasLobbyId) {
      user.socket.emit('joinlobby', this.model.lobbyId);
    } else {
      alert('no lobby');
    }
  }

  render(): React.ReactNode {
    return (<>
      <input autoComplete='off' id='lobbyid' defaultValue={this.model.lobbyId} onChange={e => this.model.setLobbyId(e.target.value)}/>
      <button onClick={() => this.onJoinLobby()}>Join Lobby</button>
      <button onClick={() => this.onCreateLobby()}>Create Lobby</button>
    </>);
  }
}
