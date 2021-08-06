import {action, computed, makeAutoObservable, observable} from 'mobx';
import OtherUser, {OtherUsers} from './OtherUser';
import OwnUser from './OwnUser';
import Wins, {Win} from './Wins';
import {user} from '../session/User';
import {CommonUser, findUserById} from './CommonUser';

/**
 * Game Singleton.
 * Is reset on every new game.
 * All game-global socket listeners go here
 */
export class Game {
  constructor() {
    makeAutoObservable(this);

    user.reconstructionCallback = this.ownUser.reconstruct;

    user.socket.on('beeselected', (selection: {queen: number, selected: number, bee: number, correct: boolean}) => {
      const win: Win = {
        queenId: selection.queen,
        correct: selection.correct,
        selectedId: selection.selected,
        beeId: selection.bee,
        articleId: findUserById(selection.bee)?.articleId
      };
      this.wins.addWin(win);
    });
  }

  @observable otherUsers = new OtherUsers();
  @observable ownUser = new OwnUser();
  @observable wins = new Wins();

  @computed get allUsers(): CommonUser[] {
    return (this.otherUsers.users as CommonUser[]).concat(this.ownUser);
  }

  @action reset() {
    this.otherUsers.reset();
    this.ownUser.reset();
    this.wins.reset();
  }
}

export const game = new Game();
