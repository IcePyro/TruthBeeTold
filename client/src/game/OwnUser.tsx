import {action, makeAutoObservable, observable} from 'mobx';
import {user} from '../session/User';
import {CommonUser} from './CommonUser';

/**
 * All data about user that can be cleared when game is over belongs here
 */
export default class OwnUser implements CommonUser {
  constructor() { makeAutoObservable(this); }

  @observable ready = false;
  @observable articleId?: string;

  public get id(): number | undefined {
    return user.id;
  }

  public get username(): string | undefined {
    return user.username;
  }

  @action setReady(ready: boolean) {
    this.ready = ready;
  }

  @action setArticleId(articleId: string | undefined) {
    this.articleId = articleId;
  }

  @action reset() {
    this.ready = false;
    this.articleId = undefined;
  }

  @action reconstruct(ready: boolean | undefined, articleId: string | undefined) {
    this.ready = ready || false;
    this.articleId = articleId;
  }
}
