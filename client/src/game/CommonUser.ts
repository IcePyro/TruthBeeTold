import {game} from './Game';

export interface CommonUser {
  id?: number;
  ready?: boolean;
  username?: string;
}

export function findUserById(id: number): CommonUser | undefined {
  return game.allUsers.find(user => user.id === id);
}
