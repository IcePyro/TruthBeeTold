import React from 'react';
import PageModel from './PageModel';
import {observer} from 'mobx-react';

export interface WaitProps {
  page: PageModel;
}

@observer
export default class Wait extends React.Component<WaitProps> {
  render() {
    return (<div style={this.props.page.enabledStyle}>
      <h1>Wait</h1>
    </div>);
  }
}
