import Cookies from 'js-cookie';
import {Socket, io} from 'socket.io-client';
import {action, makeAutoObservable, observable, runInAction} from 'mobx';

interface UserData {
  id?: number;
  ready?: boolean;
  articleID?: string;
  username?: string;
}

/**
 * Stores session information.
 * For temporary game data use {@link OwnUser}
 */
export default class User {
  private _socket?: Socket;
  @observable id?: number;
  @observable username?: string;

  /** Need this, because we cannot include game */
  public reconstructionCallback: (ready?: boolean, articleId?: string) => void = () => {return;};

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
    console.log(process.env.SERVER);

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
        this.reconstructionCallback(user.ready, user.articleID);
      });
      console.log(`Reconstructed new user with id ${user.id}`);
    });

    return s;
  }
}

export const user = new User();
