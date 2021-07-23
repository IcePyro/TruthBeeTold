import {action, makeAutoObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {ChangeEvent} from 'react';
import {user} from '../session/User';
import {StateComponent} from '../StateModel';
import OtherUser, {otherUsers} from '../game/OtherUser';
import { debounce } from 'lodash';
import OtherUserView from '../components/OtherUserView';

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
  private static readonly usernameDebounceTime = 1000;

  private model = new LobbyModel();

  constructor(props: any) {
    super(props);

    user.socket.on('lobbydata', (data: {username: string, users: Array<{userid: number, username: string, ready: boolean}>}) => {
      user.setUsername(data.username);
      const users = data.users.map(user => new OtherUser(user.userid, user.username, user.ready));
      otherUsers.setUsers(users);
    });

    user.socket.on('userjoin', (user: { userid: number, username: string }) => {
      otherUsers.addUser(new OtherUser(user.userid, user.username));
    });

    user.socket.on('changedusername', ({userid, username}: {userid: number, username: string}) => {
      if (user.id === userid) {
        if (user.username !== username) {
          console.error('Updating username did not succeed');
        }
      } else {
        otherUsers.getUserWithId(userid)?.setUsername(username);
      }
    });

    user.socket.on('toggledready', ({userid, ready}: {userid: number, ready: boolean}) => {
      if (user.id === userid) {
        if (user.ready !== ready) {
          console.error('Updating ready did not succeed');
        }
      } else {
        otherUsers.getUserWithId(userid)?.setReady(ready);
      }
    });
  }

  private onToggleReady(e: ChangeEvent<HTMLInputElement>) {
    user.ready = e.target.checked;
    user.socket.emit('toggleready', e.target.checked);
  }

  private onUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    const username = e.target.value;
    debounce(() => {
      user.setUsername(username);
      user.socket.emit('setusername', username);
    }, Lobby.usernameDebounceTime)();
  }

  render(): React.ReactNode {
    return (<div style={this.props.stateModel.enabledStyle}>
      <h1>Lobby</h1>
      <h2>Your Lobby: {this.model.lobbyId}</h2>
      <h2>Your username:</h2>
      <input defaultValue={user.username} onChange={e => this.onUsernameChange(e)}/>
      <input type='checkbox' onChange={(e) => this.onToggleReady(e)}/>
      <h2>Other Users:</h2>
      {otherUsers.views}
    </div>);
  }
}
