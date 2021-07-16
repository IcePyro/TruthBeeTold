import {action, makeAutoObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import OtherUser from '../game/OtherUser';

class LobbyModel {
  @observable otherUsers: OtherUser[] = [];

  constructor() { makeAutoObservable(this); }

  @action addOtherUser(otherUser: OtherUser) {
    this.otherUsers.push(otherUser);
  }
}

@observer
export default class Lobby extends React.Component {
  private model = new LobbyModel();

  render(): React.ReactNode {
    return (<></>);
  }
}
