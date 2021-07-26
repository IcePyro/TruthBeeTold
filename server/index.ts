import {Socket} from "socket.io";
import * as crypto from 'crypto';
import {StateID, updateUserState} from "./States/state-updater";
import {io} from './session';
import {activeUsers, getNextUserId, User} from './types/User';


export interface LobbySettings {
    any // TODO specify
}

interface Session {
    userid: number;
    constructed: number;
}


export const lobbysettings: { [key: string]: LobbySettings } = {}; //this should probably be a DB later

const sessions: { [key: string]: Session } = {};  // TODO this should also be a DB later

io.on("connection", (socket) => {
    constructSession(socket);
    //createOrJoin(socket);
    if(activeUsers[socket.data.id].room){
        socket.join(activeUsers[socket.data.id].room.id);
        console.log("rejoining user" + socket.data.id + " to room " + activeUsers[socket.data.id].room.id)
    }
    updateUserState(io,activeUsers[socket.data.id])

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.data.id} disconnected`);
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
    const session = sessions[token];

    if (token && session) {  // If session is present send old session and user data
        socket.data.id = session.userid;
        const user = activeUsers[session.userid];
        user.socket = socket;
        socket.emit('reconstruct-session', {user: {id: session.userid, ready: user.ready, articleID: user.articleID, username: user.username}});  // TODO don't reiterate interface
        console.log(`Reconstructed session for user ${session.userid}`);
    } else {  // If no session is present create a new one
        const newToken = crypto.randomBytes(16).toString('base64');
        const newUserId = getNextUserId();
        socket.data.id = newUserId;
        const newUser = new User(socket);
        const newSession: Session = {constructed: Date.now(), userid: newUserId};
        activeUsers[newUserId] = newUser;
        sessions[newToken] = newSession;

        socket.emit('construct-session', {token: newToken, userId: newUserId});
        console.log(`Created new user with id ${socket.data.id}`);
        activeUsers[socket.data.id].state = StateID.Home;
    }
}
