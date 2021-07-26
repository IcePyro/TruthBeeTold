import React from 'react';
import {observer} from 'mobx-react';
import {user} from '../session/User';
import {StateComponent} from '../StateModel';

@observer
export default class Settings extends StateComponent {
  private onOpenLobby() {
    user.socket.emit('settings', {});
  }

  render(): React.ReactNode {
    return (<div style={this.props.stateModel.enabledStyle}>
      <h1>Settings</h1>
      <button onClick={() => this.onOpenLobby()}>Open Lobby</button>
    </div>);
  }
}
