import {Server} from "socket.io";
import {User} from "../types/User";

export default function(_: Server, user: User): void{
    user.room.emitLobbyData()
}