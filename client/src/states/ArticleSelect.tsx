import React from 'react';
import {user} from '../session/User';
import {observer} from 'mobx-react';
import {StateComponent} from '../StateModel';

@observer
export default class ArticleSelect extends StateComponent {
  private selectArticle() {
    const input = document.getElementById('article-select') as HTMLInputElement;
    if (input.value) {
      user.socket.emit('lockinarticle', input.value);
    }
  }

  render() {
    return (<div style={this.props.stateModel.enabledStyle}>
      <h1>Select Article</h1>
      <input type='text' id='article-select'/>
      <button onClick={() => this.selectArticle()}>Submit</button>
    </div>);
  }
}
