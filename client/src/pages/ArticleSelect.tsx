import React from 'react';
import PageModel from './PageModel';
import {user} from '../session/User';

export interface ArticleSelectProps {
  page: PageModel;
}

export default class ArticleSelect extends React.Component<ArticleSelectProps> {
  private selectArticle() {
    const input = document.getElementById('article-select') as HTMLInputElement;
    if (input.value) {
      user.socket.emit('lockinarticle', input.value);
    }
  }

  render() {
    return (<div style={this.props.page.enabledStyle}>
      <input type='text' id='article-select'/>
      <button onClick={() => this.selectArticle()}>Submit</button>
    </div>);
  }
}
