import {Server} from "socket.io";
import {User} from "../types/User";

export default function (io: Server, user: User): void{
    io.to(user.room.id).emit('selectedarticle', user.room.bee.articleID);
}