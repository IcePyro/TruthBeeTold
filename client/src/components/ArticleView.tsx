import React from 'react';
import {action, makeAutoObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import {user} from '../session/User';

class ArticleViewModel {
  constructor() { makeAutoObservable(this); }
  @observable article = '';
  @action setArticle(article: string) {
    this.article = article;
  }
}

@observer
export default class ArticleView extends React.Component {
  private model = new ArticleViewModel();

  componentDidMount() {
    user.socket.on('selectedarticle', (article: string) => {
      this.model.setArticle(article);
    });
  }

  render() {
    return <h2>Article: {this.model.article}</h2>;
  }
}
