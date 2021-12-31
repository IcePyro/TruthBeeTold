import {Socket} from "socket.io";
import * as crypto from 'crypto';
import {StateID, updateUserState} from "./States/state-updater";
import {io} from './session';
import {activeUsers, getNextUserId, User} from './types/User';
import logger from "./logger/logger";

import {wiki, WikiOptions} from './wiki/'


const wikiOptions: WikiOptions = {
    domain: 'wikipedia.org',
    lang: 'de',
    ns: 0
};

export interface LobbySettings {
    any // TODO specify
}

export interface Session {
    userid: number;
    constructed: number;
}

export const w = wiki(wikiOptions);

w.pullNewCategory("Wikipedia:Kuriositätenkabinett")

export const lobbysettings: { [key: string]: LobbySettings } = {}; //this should probably be a DB later

export const sessions: Map<string, Session> = new Map<string, Session>() // TODO this should also be a DB later

io.on("connection", (socket) => {
    constructSession(socket);

    updateUserState(io, activeUsers[socket.data.id])

    socket.on("disconnect", () => {
        logger.logUser(`Socket ${socket.id} disconnected`, activeUsers[socket.data.id]);
        if(activeUsers[socket.data.id].room) {
            activeUsers[socket.data.id].room.notifyDisconnect(socket.data.id)
        }
    });
});
// app.get("/", (req,res) =>{
//     res.sendFile(__dirname + "/index.html");
// })

/**
 * Try to reconstruct session for socket if possible or create a new one.
 * TODO don't reconstruct session if socket is still active (for example because of multiple tabs), how to handle this?
 */
function constructSession(socket: Socket) {
    const token = socket.handshake.query?.token as string | undefined;
    const session = sessions.get(token);


    if (token && session) {  // If session is present send old session and user data
        socket.data.id = session.userid;
        const user = activeUsers[session.userid];
        user.socket = socket;
        socket.emit('reconstruct-session', {user: {id: session.userid, ready: user.ready, articleID: user.articleID, username: user.username}});  // TODO don't reiterate interface
        logger.logUser(`Reconstructed session, new Socket: ${socket.id}`, user);
    } else {  // If no session is present create a new one
        const newToken = crypto.randomBytes(16).toString('base64');
        const newUserId = getNextUserId();

        socket.data.id = newUserId;

        const newUser = new User(socket);
        newUser.sessionToken = newToken;

        const newSession: Session = {constructed: Date.now(), userid: newUserId};
        activeUsers[newUserId] = newUser;
        sessions.set(newToken, newSession)

        socket.emit('construct-session', {token: newToken, userId: newUserId});
        logger.logUser('Created', newUser);
        activeUsers[socket.data.id].state = StateID.Home;
    }
}
