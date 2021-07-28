import {action, makeAutoObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {ChangeEvent} from 'react';
import {user} from '../session/User';
import {StateComponent} from '../StateModel';
import OtherUser from '../game/OtherUser';
import { debounce, without } from 'lodash';
import ClipboardJS from 'clipboard';
import OtherUserView from '../components/OtherUserView';
import {game} from '../game/Game';

class LobbyModel {
  constructor() { makeAutoObservable(this); }

  @observable lobbyId = '';

  @action setLobbyId(lobbyId: string) {
    this.lobbyId = lobbyId;
  }
}

@observer
export default class Lobby extends StateComponent {
  private static readonly usernameDebounceTime = 1000;

  private model = new LobbyModel();

  public componentDidMount() {
    new ClipboardJS('#copylobbyid', {text: () => this.lobbyUrl});

    user.socket.on('lobbydata', ({lobbyId, users}: {lobbyId: string, users: Array<{userid: number, username: string, ready: boolean}>}) => {
      const me = users.find(user => game.ownUser.id === user.userid);
      if (!me) return console.error('Could not find own user in lobby data');
      const others = without(users, me).map(other => new OtherUser(other.userid, other.username, other.ready));

      this.model.setLobbyId(lobbyId);
      user.setUsername(me.username);
      game.otherUsers.setUsers(others);
    });

    user.socket.on('changedusername', ({userid, username}: {userid: number, username: string}) => {
      if (user.id === userid) {
        if (user.username !== username) {
          console.error('Updating username did not succeed');
        }
      } else {
        game.otherUsers.getUserWithId(userid)?.setUsername(username);
      }
    });

    user.socket.on('toggledready', ({userid, ready}: {userid: number, ready: boolean}) => {
      if (user.id === userid) {
        if (game.ownUser.ready !== ready) {
          console.error('Updating ready did not succeed');
        }
      } else {
        game.otherUsers.getUserWithId(userid)?.setReady(ready);
      }
    });
  }

  private onToggleReady(e: ChangeEvent<HTMLInputElement>) {
    game.ownUser.ready = e.target.checked;
    user.socket.emit('toggleready', e.target.checked);
  }

  private onUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    const username = e.target.value;
    debounce(() => {
      user.setUsername(username);
      user.socket.emit('setusername', username);
    }, Lobby.usernameDebounceTime)();
  }

  private get lobbyUrl(): string {
    const url = window.location.toString().split('#')[0];
    const withoutSlash = url.endsWith('/') ? url.substr(0, url.length - 1) : url;
    const withoutProtocol = withoutSlash.replace(/http(s?):\/\//, '');
    return `${withoutProtocol}#${this.model.lobbyId}`;
  }

  render(): React.ReactNode {
    return (<div style={this.props.stateModel.enabledStyle}>
      <h1>Lobby</h1>
      <h2>Your Lobby:</h2>
      <a id='copylobbyid'>{this.lobbyUrl}</a>
      <h2>Your username:</h2>
      <input defaultValue={user.username} onChange={e => this.onUsernameChange(e)}/>
      <input type='checkbox' onChange={(e) => this.onToggleReady(e)}/>
      <h2>Other Users:</h2>
      {game.otherUsers.users.map((user, i) => <OtherUserView otherUser={user} key={i} />)}
    </div>);
  }
}
