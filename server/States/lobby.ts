import {StateID, updateUserState} from "./state-updater";
import {User} from '../types/User';
import {io} from '../session';
import {Server} from "socket.io";
import logger from "../logger/logger";

export default function(_: Server, user: User):void{
    user.ready = false;
    user.room.emitLobbyData()

    user.socket.on('setusername', (username: string) => {
        user.username = username;
        logger.logUser(`Renamed`, user);
        user.room.emitAll('changedusername', {userid: user.id, username});
    });

    user.socket.on('toggleready', (ready: boolean) => {
        user.ready = ready;
        logger.logUser(`Ready: ${user.ready}`, user);
        const allReady = user.room.allReady;
        logger.logRoom(`All sockets ready: ${allReady}`, user.room);
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
