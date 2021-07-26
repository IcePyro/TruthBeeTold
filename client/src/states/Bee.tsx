import React from 'react';
import {observer} from 'mobx-react';
import ArticleView from '../components/ArticleView';
import {StateComponent} from '../StateModel';

@observer
export default class Bee extends StateComponent {
  render() {
    return (<div style={this.props.stateModel.enabledStyle}>
      <h1>Bee (or Wasp)</h1>
      <ArticleView />
    </div>);
  }
}
