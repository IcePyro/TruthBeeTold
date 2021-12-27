import {Socket} from 'socket.io';
import {io} from '../session';
import {activeUsers, User} from './User';
import {StateID, updateMultipleUserStates} from '../States/state-updater';

const activeRooms: { [key: string]: Room } = {};

export default class Room {
    public static byId(id: string): Room {
        if(activeRooms[id]){
            return activeRooms[id]
        }else{
            activeRooms[id] = new Room(id);
            return  activeRooms[id]
        }
    }

    private constructor(public id: string) {}

    private joinedUsers:number[] = []

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

    public newQueen(): User {
        const users = this.users;
        return users[Math.floor(Math.random() * users.length)];
    }

    public newBee(): User {
        const users = this.usersWithout(this.queen);
        return users[Math.floor(Math.random() * users.length)];
    }

    public emitAll(event: string, data: any) {
        io.to(this.id).emit(event, data);
    }

    public emitAllWithout(user: User, event: string, data: any) {
        this.usersWithout(user).forEach(user => user.socket.emit(event, data));
    }

    public updateStates(){
        updateMultipleUserStates(io, this.users)
    }
}

