import React from 'react';
import PageModel from './PageModel';

export interface WaitProps {
  page: PageModel;
}

export default class Wait extends React.Component<WaitProps> {
  render() {
    return (<div style={this.props.page.enabledStyle}>
    </div>);
  }
}
