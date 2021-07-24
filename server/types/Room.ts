import {Socket} from 'socket.io';
import {io} from '../session';
import {activeUsers, User} from './User';
import {StateID} from '../States/state-updater';

export default class Room {
    public static byId(id: string): Room {
        return new Room(id);
    }

    private constructor(private id: string) {}

    public get sockets(): Socket[] {
        return Array.from(io.of("/").adapter.rooms.get(this.id)).map((socketID) => {
            return io.sockets.sockets.get(socketID);
        });
    }

    public get users(): User[] {
        return this.sockets.map(s => activeUsers[s.data.id]);
    }

    public usersWithout(user: User): User[] {
        return this.users.filter(otherUser => otherUser.id !== user.id);
    }

    public get bee(): User | undefined {
        return this.users.find(user => user.state === StateID.Bee);
    }

    public get allReady(): boolean {
        return this.users.every(user => user.ready) && this.users.length >= 3;
    }

    public emitAll(event: string, data: any) {
        io.to(this.id).emit(event, data);
    }

    public emitAllWithout(user: User, event: string, data: any) {
        this.usersWithout(user).forEach(user => user.socket.emit(event, data));
    }
}

