import {Socket} from 'socket.io';
import {io} from '../session';
import {activeUsers, User} from './User';
import {StateID, updateMultipleUserStates} from '../States/state-updater';
import sha256 = require("crypto-js/sha256");
import {sessions, terminateSession} from "../index";

const activeRooms: Map<string, Room> = new Map<string, Room>();
let lobbyCounter = 0;

export default class Room {
    public static byId(id: string): Room {

        if(activeRooms.has(id)){
            return activeRooms.get(id)
        }else{
            activeRooms.set(id, new Room(id))
            return  activeRooms.get(id)
        }
    }

    private constructor(public id: string) {}

    private joinedUsers:number[] = []

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
                return without.find(findUser =>{
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

    public join(userID) {
        if (this.joinedUsers.includes(userID)) {
            return
        } else {
            this.joinedUsers.push(userID)
        }
    }

    public leave(userID){
        this.joinedUsers = this.joinedUsers.filter(u => u !== userID)
    }

    public notifyDisconnect(userID:number){
        if(this.joinedUsers.every(uID => activeUsers[uID].socket.disconnected === true)){
            this.joinedUsers.forEach(uID => {
                terminateSession(activeUsers[uID].sessionToken)

            })
            activeRooms.delete(this.id)
        }
        if(!this.isIngame){
            this.leave(userID)
            terminateSession(activeUsers[userID].sessionToken)
            this.emitLobbyData()
        }
    }

    public newQueen(): User {
        const users = this.users;
        return users[Math.floor(Math.random() * users.length)];
    }

    public newBee(): User {
        const users = this.usersWithout(this.queen);
        return users[Math.floor(Math.random() * users.length)];
    }

    public emitAll(event: string, data: any) {
        this.users.forEach(user => user.socket.emit(event, data))
    }

    public emitLobbyData(){
        this.emitAll('lobbydata', {
            lobbyId: this.id,
            users: this.users.map(user => ({userid: user.id, username: user.username, ready: user.ready}))
        });
    }

    public emitAllWithout(user: User, event: string, data: any) {
        this.usersWithout(user).forEach(user => user.socket.emit(event, data));
    }

    public updateStates(){
        updateMultipleUserStates(io, this.users)
    }

    /*@returns a hash generated from an internal counter and the current datetime, converted to a base ten number and cut to length 7.
     * checks for collision with existing rooms, and generates a new id on collision. This will produce a collision about every 3000 hashes*/
    public static newRoomID(): string{
        lobbyCounter += 1;

        const hrTime = process.hrtime();

        const hash = sha256(lobbyCounter.toString() + (hrTime[0] * 1000000 + hrTime[1] / 1000).toString()).toString().slice(0,9);

        let id = parseInt(hash, 16).toString().slice(0,7);

        if(activeRooms.has(id)){
            id = this.newRoomID()
        }

        console.log("new lobby id created: " + id);
        return id;
    }
}

