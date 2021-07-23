import {observer} from 'mobx-react';
import OtherUser from '../game/OtherUser';
import React from 'react';

export interface OtherUserViewProps {
  otherUser: OtherUser;
}

@observer
export default class OtherUserView extends React.Component<OtherUserViewProps> {
  render() {
    return (
      <div>
        <span>{ this.props.otherUser.username }</span>
        <input type='checkbox' onClick={() => false} value={ this.props.otherUser.ready ? 1 : 0 }/>
      </div>
    );
  }
}
