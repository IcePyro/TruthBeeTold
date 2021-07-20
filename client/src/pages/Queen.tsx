import React from 'react';
import PageModel from './PageModel';

export interface QueenProps {
  page: PageModel;
}

export default class Queen extends React.Component<QueenProps> {
  render() {
    return (<div style={this.props.page.enabledStyle}>
    </div>);
  }
}
