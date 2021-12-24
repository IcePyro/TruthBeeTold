import React from 'react';
import {observer} from 'mobx-react';
import {user} from '../session/User';
import {StateComponent} from '../StateModel';
import {Page} from '../components/Page';

@observer
export default class Settings extends StateComponent {
  private onOpenLobby() {
    user.socket.emit('settings', {});
  }

  render(): React.ReactNode {
    return (<Page enabled={this.props.stateModel.enabled}
      startOfPage={
        <>
          <h1>Settings</h1>
        </>
      } endOfPage={
        <>
          <button onClick={() => this.onOpenLobby()}>Open Lobby</button>
        </>
      }/>);
  }
}
