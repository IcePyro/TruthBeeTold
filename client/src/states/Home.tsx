import React from 'react';
import '../styles/home.sass';
import {user} from '../session/User';
import {observer} from 'mobx-react';
import {action, computed, makeAutoObservable, observable} from 'mobx';
import {StateComponent} from '../StateModel';
import {game} from '../game/Game';
import {Page} from '../components/Page';
import {Button, FormControl, InputGroup} from 'react-bootstrap';



class HomeModel {
  constructor() {
    makeAutoObservable(this);
  }

  @observable lobbyId?: string;

  @action setLobbyId(lobbyId: string) {
    this.lobbyId = lobbyId;
  }

  @computed get hasLobbyId(): boolean {
    return !!this.lobbyId;
  }
}

@observer
export default class Home extends StateComponent {
  private model = new HomeModel();

  public componentDidMount() {
    game.reset();

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
    return (
      <div style={this.props.stateModel.enabledStyle}>
        <h1>Home</h1>
        <FormControl id="lobbyid" defaultValue={this.model.lobbyId}
          onChange={e => this.model.setLobbyId(e.target.value)}/>
        <Button onClick={() => this.onJoinLobby()}>Join Lobby</Button>
        <Button onClick={() => this.onCreateLobby()}>Create Lobby</Button>
      </div>
    );
  }
}
