import {action, computed, makeAutoObservable, observable} from 'mobx';
import OtherUserView from '../components/OtherUserView';
import {CommonUser} from './CommonUser';

export default class OtherUser implements CommonUser {
  constructor(id: number, username: string, ready = false) {
    this.id = id;
    this.username = username;
    this.ready = ready;
    makeAutoObservable(this);
  }

  @observable id = -1;
  @observable username = '';
  @observable ready = false;
  @observable hasArticle = false;

  @action setReady(ready: boolean) {
    this.ready = ready;
  }

  @action setUsername(username: string) {
    this.username = username;
  }

  @action setHasArticle(hasArticle: boolean) {
    this.hasArticle = hasArticle;
  }
}

export class OtherUsers {
  constructor() { makeAutoObservable(this); }

  @observable users: OtherUser[] = [];

  @action addUser(otherUser: OtherUser) {
    this.users.push(otherUser);
  }

  @action setUsers(otherUsers: OtherUser[]) {
    this.users = otherUsers;
  }

  @action clear() {
    this.users = [];
  }

  @computed getUserWithId(id: number): OtherUser | undefined {
    return this.users.find(user => user.id === id);
  }

  @computed get views(): JSX.Element[] {
    return this.users.map((user, i) => <OtherUserView otherUser={user} key={i} />);
  }

  @computed get names(): string[] {
    return this.users.map(u => u.username);
  }

  @action reset() {
    this.users = [];
  }
}
