import React from 'react';
import {observer} from 'mobx-react';
import {StateComponent} from '../StateModel';
import {LastWinView} from '../components/LastWinView';
import {Page} from '../components/Page';

@observer
export default class Wait extends StateComponent {
  render() {
    return (<Page enabled={this.props.stateModel.enabled}
      startOfPage={
        <>
          <LastWinView />
          <h1>Wait</h1>
        </>
      } />);
  }
}
