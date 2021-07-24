import {action, computed, makeAutoObservable, observable} from 'mobx';
import OtherUserView from '../components/OtherUserView';

export default class OtherUser {
  constructor(id: number, username: string, ready = false) {
    this.id = id;
    this.username = username;
    this.ready = ready;
    makeAutoObservable(this);
  }

  @observable id = -1;
  @observable username = '';
  @observable ready = false;

  @action setReady(ready: boolean) {
    this.ready = ready;
  }

  @action setUsername(username: string) {
    this.username = username;
  }
}

export class OtherUsers {
  private static _instance = new OtherUsers();
  public static get instance() { return OtherUsers._instance; }

  private constructor() { makeAutoObservable(this); }

  @observable otherUsers: OtherUser[] = [];

  @action addUser(otherUser: OtherUser) {
    this.otherUsers.push(otherUser);
  }

  @action setUsers(otherUsers: OtherUser[]) {
    this.otherUsers = otherUsers;
  }

  @action clear() {
    this.otherUsers = [];
  }

  @computed getUserWithId(id: number): OtherUser | undefined {
    return this.otherUsers.find(user => user.id === id);
  }

  @computed get views(): JSX.Element[] {
    return this.otherUsers.map((user, i) => <OtherUserView otherUser={user} key={i} />);
  }
}

export const otherUsers = OtherUsers.instance;
