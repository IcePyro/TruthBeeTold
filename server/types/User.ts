import {Socket} from 'socket.io';
import Room from "./Room";

export class User {
    constructor(socket) {
        this.socket = socket;
        this.id = socket.data.id;
    }

    ready?: boolean;
    articleID?: string;
    socket?: Socket;
    username?: string = generateUsername();
    state?: number;
    room?: Room;
    id?: number;
    sessionToken?: string;
}

let nextUserId = 0;
export const activeUsers: { [key: number]: User } = {}; //this should probably be a DB later
export function getNextUserId(): number {
    return nextUserId++;
}

function generateUsername(): string {
    return 'Random Username 123';
}
