import {action, makeAutoObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import PageModel, {Page} from './PageModel';
import {user} from '../session/User';

class LobbyModel {
  constructor() { makeAutoObservable(this); }

}

export interface LobbyProps {
  page: PageModel;
}

@observer
export default class Lobby extends React.Component<LobbyProps> {
  private model = new LobbyModel();

  constructor(props: any) {
    super(props);
    user.socket.once('gamestart', () => {
      this.props.page.onNextPage(Page.Game);
    });
  }

  private onToggleReady() {
    user.socket.emit('toggleready');
  }

  render(): React.ReactNode {
    return (<div style={this.props.page.enabledStyle}>
      <h1>Lobby</h1>
      <input type='checkbox' onChange={() => this.onToggleReady()}/>
    </div>);
  }
}
