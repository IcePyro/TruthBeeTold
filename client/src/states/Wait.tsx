import React from 'react';
import {observer} from 'mobx-react';
import {StateComponent} from '../StateModel';
import {LastWinView} from '../components/LastWinView';

@observer
export default class Wait extends StateComponent {
  render() {
    return (<div style={this.props.stateModel.enabledStyle}>
      <LastWinView />
      <h1>Wait</h1>
    </div>);
  }
}
