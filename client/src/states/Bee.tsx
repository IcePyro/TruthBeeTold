import React from 'react';
import {observer} from 'mobx-react';
import ArticleView from '../components/ArticleView';
import {StateComponent} from '../StateModel';
import {Page} from '../components/Page';

@observer
export default class Bee extends StateComponent {
  render() {
    return (<Page enabled={this.props.stateModel.enabled}
      startOfPage={
        <>
          <h1>Bee (or Wasp)</h1>
          <ArticleView/>
        </>
      }/>);
  }
}
