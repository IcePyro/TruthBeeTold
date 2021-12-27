import {StateID, updateUserState} from "./state-updater";
import {User} from '../types/User';
import {io} from '../session';
import {Server} from "socket.io";

export default function(_: Server, user: User):void{
    user.ready = false;
    console.log("socket joined lobby: " + user.room.id);


    user.room.emitLobbyData()

    user.socket.on('setusername', (username: string) => {
        user.username = username;
        console.log(`user ${user.id} is now called ${user.username}`);
        user.room.emitAll('changedusername', {userid: user.id, username});
    });

    user.socket.on('toggleready', (ready: boolean) => {
        user.ready = ready;
        console.log(`user ${user.id} ready: ${user.ready}`);
        const allReady = user.room.allReady;
        console.log(`All sockets in user.room ${user.room.id} ready: ${allReady}`);
        if (allReady) {
            user.room.isIngame = true
            user.room.users.forEach((user) =>{
                user.state = StateID.ArticleSelect
                updateUserState(io, user)
            })
        } else {
            user.room.emitAll('toggledready', {userid: user.id, ready});
        }
    });
}
