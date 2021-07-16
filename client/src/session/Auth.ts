import {Socket, io} from 'socket.io-client';

export default class Auth {
  private static _socket?: Socket;

  public static get socket(): Socket {
    if (!this._socket) {
      this._socket = io(process.env.SERVER ||'http://localhost:3000');
    }
    return this._socket;
  }
}
