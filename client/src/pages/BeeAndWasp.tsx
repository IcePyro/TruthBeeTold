import React from 'react';
import PageModel from './PageModel';

export interface BeeAndWaspProps {
  page: PageModel;
}

export default class BeeAndWasp extends React.Component<BeeAndWaspProps> {
  render() {
    return (<div style={this.props.page.enabledStyle}>
    </div>);
  }
}
