import {Socket} from 'socket.io';
import Room from "./Room";
import logger from "../logger/logger";
import {StateID} from "../States/state-updater";

export class User {
    constructor(socket:Socket) {
        this.socket = socket;
        this.id = socket.data.id;
    }

    ready?: boolean;
    articleID?: string;
    socket?: Socket;
    username?: string = generateUsername();
    state?: number;
    room?: Room;
    roomTimeout?: NodeJS.Timeout;
    id?: number;
    sessionToken?: string;

    reset(): void{
        delete this.ready;
        delete this.articleID;
        delete this.room;

        this.state = StateID.Home

        logger.logUser('Reset', this);
    }
}

let nextUserId = 0;
export const activeUsers: { [key: number]: User } = {}; //this should probably be a DB later
export function getNextUserId(): number {
    return nextUserId++;
}

function generateUsername(): string {
    return 'Unnamed User';
    //TODO make this more fun
}
