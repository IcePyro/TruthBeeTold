import {StateID, updateUserState} from "./state-updater";
import Room from '../types/Room';
import {activeUsers} from '../types/User';
import {io} from '../session';

export function init(_1, _2, userID, roomID){
    activeUsers[userID].ready = false;
    console.log("socket joined lobby: " + roomID);

    const user = activeUsers[userID];
    const room = Room.byId(roomID);

    user.socket.emit('lobbydata', {
        username: user.username,
        users: room.usersWithout(user).map(user => ({userid: user.id, username: user.username, ready: user.ready}))
    });

    room.emitAllWithout(user, 'userjoin', {userid: user.id, username: user.username});

    user.socket.on('setusername', (username: string) => {
        user.username = username;
        console.log(`user ${user.id} is now called ${user.username}`);
        room.emitAll('changedusername', {userid: user.id, username});
    });

    user.socket.on('toggleready', (ready: boolean) => {
        user.ready = ready;
        console.log(`user ${user.id} ready: ${user.ready}`);
        const allReady = room.allReady;
        console.log(`All sockets in room ${roomID} ready: ${allReady}`);
        if (allReady) {
            for (const user of room.users) {
                user.state = StateID.ArticleSelect
                updateUserState(io, activeUsers, user.id, roomID)
            }
        } else {
            room.emitAll('toggledready', {userid: user.id, ready});
        }
    });
}
