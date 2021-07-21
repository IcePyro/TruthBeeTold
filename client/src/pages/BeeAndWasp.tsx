import React from 'react';
import PageModel from './PageModel';
import {observer} from 'mobx-react';
import ArticleView from '../components/ArticleView';

export interface BeeAndWaspProps {
  page: PageModel;
}

@observer
export default class BeeAndWasp extends React.Component<BeeAndWaspProps> {
  render() {
    return (<div style={this.props.page.enabledStyle}>
      <h1>Bee (or Wasp)</h1>
      <ArticleView />
    </div>);
  }
}