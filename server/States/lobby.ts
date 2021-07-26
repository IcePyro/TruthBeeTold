import {StateID, updateUserState} from "./state-updater";
import room from '../types/room';
import {activeUsers, User} from '../types/User';
import {io} from '../session';

export function init(_1, user: User){
    user.ready = false;
    console.log("socket joined lobby: " + user.room.id);


    user.socket.emit('lobbydata', {
        lobbyId: user.room.id,
        username: user.username,
        users: user.room.usersWithout([user]).map(user => ({userid: user.id, username: user.username, ready: user.ready}))
    });

    user.room.emitAllWithout(user, 'userjoin', {userid: user.id, username: user.username});

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