import React from 'react';
import PageModel from './PageModel';
import {user} from '../session/User';
import {observer} from 'mobx-react';

export interface ArticleSelectProps {
  page: PageModel;
}

@observer
export default class ArticleSelect extends React.Component<ArticleSelectProps> {
  private selectArticle() {
    const input = document.getElementById('article-select') as HTMLInputElement;
    if (input.value) {
      user.socket.emit('lockinarticle', input.value);
    }
  }

  render() {
    return (<div style={this.props.page.enabledStyle}>
      <h1>Select Article</h1>
      <input type='text' id='article-select'/>
      <button onClick={() => this.selectArticle()}>Submit</button>
    </div>);
  }
}
