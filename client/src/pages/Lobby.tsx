import {action, makeAutoObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

class LobbyModel {

  constructor() { makeAutoObservable(this); }

}

@observer
export default class Lobby extends React.Component {
  private model = new LobbyModel();

  render(): React.ReactNode {
    return (<></>);
  }
}
