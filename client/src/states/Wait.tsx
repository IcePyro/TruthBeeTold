import React from 'react';
import {observer} from 'mobx-react';
import {StateComponent} from '../StateModel';

@observer
export default class Wait extends StateComponent {
  render() {
    return (<div style={this.props.stateModel.enabledStyle}>
      <h1>Wait</h1>
    </div>);
  }
}
