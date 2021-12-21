import {StateID, updateUserState} from "./state-updater";
import {activeUsers, User} from '../types/User';
import {io} from '../session';

export default function(_1, user: User){
    user.ready = false;
    console.log("socket joined lobby: " + user.room.id);


    user.room.emitAll('lobbydata', {
        lobbyId: user.room.id,
        users: user.room.users.map(user => ({userid: user.id, username: user.username, ready: user.ready}))
    });

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
            user.room.users.forEach((user) =>{
                user.state = StateID.ArticleSelect
                updateUserState(io, user)
            })
        } else {
            user.room.emitAll('toggledready', {userid: user.id, ready});
        }
    });
}
