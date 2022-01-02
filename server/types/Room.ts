import {Socket} from 'socket.io';
import {io} from '../session';
import {activeUsers, User} from './User';
import {StateID} from '../States/state-updater';
import logger from "../logger/logger";
import sha256 = require("crypto-js/sha256");

const activeRooms: Map<string, Room> = new Map<string, Room>();
let lobbyCounter = 0;

export default class Room {
    public static byId(id: string): Room {

        if (activeRooms.has(id)) {
            return activeRooms.get(id)
        } else {
            activeRooms.set(id, new Room(id))
            return activeRooms.get(id)
        }
    }

    private constructor(public id: string) {
    }

    private joinedUsers: number[] = []

    public isIngame = false

    public get sockets(): Socket[] {
        return Array.from(io.of("/").adapter.rooms.get(this.id)).map((socketID) => {
            return io.sockets.sockets.get(socketID);
        });
    }

    public get users(): User[] {
        return this.joinedUsers.map(uID => activeUsers[uID])
        //return this.sockets.map(s => activeUsers[s.data.id]);
    }

    public usersWithout(...without: User[]): User[] {
        return this.users.filter((user) => {
            return without.find(findUser => {
                return user.id === findUser.id;
            }) === undefined;
        });
    }

    public usersInState(state: StateID): User[] {
        return this.users.filter(user => user.state === state);
    }

    public get bee(): User | undefined {
        return this.users.find(user => user.state === StateID.Bee);
    }

    public get queen(): User | undefined {
        return this.users.find(user => user.state === StateID.Queen);
    }

    public get allReady(): boolean {
        return this.users.every(user => user.ready) && this.users.length >= 3;
    }

    public get allArticleLock(): boolean {
        return this.users.every(user => user.articleID);
    }

    //TODO refactor userID to user
    public join(userID: number): void {
        if (this.joinedUsers.includes(userID)) {
            logger.warn({
                msg: 'Already in Room, should not be able to send join requests',
                user: activeUsers[userID]
            })
            return
        } else {
            this.joinedUsers.push(userID)
            logger.logUser('User joined', activeUsers[userID])
        }
    }

    public leave(userID: number): void {
        this.joinedUsers = this.joinedUsers.filter(u => u !== userID)
        logger.logUser('Left', activeUsers[userID])
    }

    public async notifyDisconnect(userID: number): Promise<void> {
        if (this.joinedUsers.every(uID => activeUsers[uID].socket.disconnected === true)) {
            this.joinedUsers.forEach(uID => {
                activeUsers[uID].reset()

            })
            activeRooms.delete(this.id)
            logger.logRoom('Room Deleted', this)
        }
        if (!this.isIngame) {
            activeUsers[userID].roomTimeout = setTimeout(() => {
                console.log("time is up")
                if (activeUsers[userID].socket.disconnected) {
                    this.removeUser(activeUsers[userID])
                }
            }, 5000)

        } else {
            //TODO ask lobby host, if he wants to kick or to wait
        }
    }

    private removeUser(user) {
        this.leave(user.id)
        user.reset()
        this.emitLobbyData()
    }


    public newQueen(): User {
        const users = this.users;
        return users[Math.floor(Math.random() * users.length)];
    }

    public newBee(): User {
        const users = this.usersWithout(this.queen);
        return users[Math.floor(Math.random() * users.length)];
    }

    public emitAll(event: string, data: any): void {
        this.users.forEach(user => user.socket.emit(event, data))
        logger.logRoom(`Emitted to all: "${event}"`, this)
    }

    public emitLobbyData(): void {
        this.emitAll('lobbydata', {
            lobbyId: this.id,
            users: this.users.map(user => ({userid: user.id, username: user.username, ready: user.ready}))
        });
    }


    /*@returns a hash generated from an internal counter and the current datetime, converted to a base ten number and cut to length 7.
     * checks for collision with existing rooms, and generates a new id on collision. This will produce a collision about every 3000 hashes*/
    public static newRoomID(): string {
        lobbyCounter += 1;

        const hrTime = process.hrtime();

        const hash = sha256(lobbyCounter.toString() + (hrTime[0] * 1000000 + hrTime[1] / 1000).toString()).toString().slice(0, 9);

        let id = parseInt(hash, 16).toString().slice(0, 7);

        if (activeRooms.has(id)) {
            id = this.newRoomID()
        }
        return id;
    }

}

