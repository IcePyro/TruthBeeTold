import React from 'react';
import {observer} from 'mobx-react';
import PageModel, {Page} from './PageModel';
import {user} from '../session/User';

export interface SettingsProps {
  page: PageModel;
}

@observer
export default class Settings extends React.Component<SettingsProps> {

  private onOpenLobby() {
    user.socket.emit('settings', {});
    this.props.page.onNextPage(Page.Lobby);
  }

  render(): React.ReactNode {
    return (<div style={this.props.page.enabledStyle}>
      <h1>Settings</h1>
      <button onClick={() => this.onOpenLobby()}>Open Lobby</button>
    </div>);
  }
}
