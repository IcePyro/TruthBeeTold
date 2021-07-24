import {observer} from 'mobx-react';
import OtherUser from '../game/OtherUser';
import React from 'react';

import '../styles/readonly-ready.sass';
import {ReadonlyReady} from './ReadonlyReady';

export interface OtherUserViewProps {
  otherUser: OtherUser;
}

@observer
export default class OtherUserView extends React.Component<OtherUserViewProps> {
  render() {
    return (
      <div>
        <span>{ this.props.otherUser.username }</span>
        <ReadonlyReady ready={this.props.otherUser.ready} />
      </div>
    );
  }
}
