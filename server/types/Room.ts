import {Socket} from 'socket.io';
import {io} from '../session';
import {activeUsers, User} from './User';

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

    public get allReady(): boolean {
        return this.users.every(user => user.ready) && this.users.length >= 3;
    }

    public emitAll(event: string, data: any) {
        this.users.forEach(user => user.socket.emit(event, data));
    }

    public emitAllWithout(user: User, event: string, data: any) {
        const users = this.usersWithout(user);
        users.forEach(user => user.socket.emit(event, data));
    }
}

