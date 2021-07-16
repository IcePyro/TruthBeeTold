import { makeAutoObservable, observable } from 'mobx';

export default class OtherUser {
  @observable username = '';

  constructor() { makeAutoObservable(this); }
}
