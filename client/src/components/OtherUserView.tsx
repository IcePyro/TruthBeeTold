import {observer} from 'mobx-react';
import OtherUser from '../game/OtherUser';
import React from 'react';

import '../styles/other-user-view.sass';

export interface OtherUserViewProps {
  otherUser: OtherUser;
}

@observer
export default class OtherUserView extends React.Component<OtherUserViewProps> {
  render() {
    return (
      <div>
        <span>{ this.props.otherUser.username }</span>
        <div className={ 'other-ready' + (this.props.otherUser.ready ? ' ready' : '')}/>
      </div>
    );
  }
}
