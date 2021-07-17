import Cookies from 'js-cookie';
import {Socket, io} from 'socket.io-client';
import {action, makeAutoObservable, observable, runInAction} from 'mobx';

interface UserData {
  id?: number;
  ready?: boolean;
  articleID?: string;
  username?: string;
}

export default class User {
  private static _instance?: User;

  public static get instance(): User {
    if (!this._instance) {
      this._instance = new User();
    }
    return this._instance;
  }

  private _socket?: Socket;
  @observable id?: number;
  @observable ready?: boolean;
  @observable articleID?: string;
  @observable username?: string;

  constructor() {makeAutoObservable(this);}

  public get socket(): Socket {
    if (!this._socket) {
      this._socket = this.init();
    }
    return this._socket;
  }

  @action setUsername(username: string) {
    this.username = username;
  }

  /**
   * Create connection with server.
   * Tries to pass existing token, if none exists it waits for the server to assign one
   */
  private init(): Socket {
    const tokenCookie = Cookies.get('token');  // Can be undefined
    // @ts-ignore
    const s = io(process.env.SERVER || 'http://localhost:3000', {query: {token: tokenCookie}});

    s.on('construct-session', ({token, userId}: {token: string, userId: number}) => {
      Cookies.set('token', token);
      runInAction(() => {
        this.id = userId;
      });
      console.log(`Constructed new user with id ${userId}`);
    });

    s.on('reconstruct-session', ({user}: {user: UserData}) => {
      runInAction(() => {
        this.id = user.id;
        this.username = user.username;
        this.articleID = user.articleID;
        this.ready = user.ready;
      });
      console.log(`Reconstructed new user with id ${user.id}`);
    });

    return s;
  }
}

/**
 * Shortcut for getting the user
 */
export const user = User.instance;
