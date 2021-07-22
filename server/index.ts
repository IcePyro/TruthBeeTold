import * as express from 'express';
//import * as https from 'https';
import * as http from 'http';
import {Server, Socket} from "socket.io";
import * as crypto from 'crypto';
import * as fs from 'fs';

require("dotenv").config();
import {updateUserState} from "./States/state-updater";
import {StateID} from "./States/state-updater";

/*const options = {
    key: fs.readFileSync(process.env.KEYLOCATION),
    cert: fs.readFileSync(process.env.CERTLOCATION)
}*/
const port = parseInt(process.env.PORT || '3000');
const app = express();
const server = http.createServer(app);
//const server = https.createServer(options, app)
//console.log("options-key:" + options.key)
//console.log("key: " + process.env.KEYLOCATION)
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT || 'http://localhost:1234'
    }
});


export interface User {
    ready?: boolean;
    articleID?: string;
    socket?: Socket;
    username?: string;
    state?: number;
    roomID?: string;
}

export interface LobbySettings {
    any // TODO specify
}

interface Session {
    userid: number;
    constructed: number;
}

let nextUserId = 0;
const activeUsers: { [key: number]: User } = {}; //this should probably be a DB later

export const lobbysettings: { [key: string]: LobbySettings } = {}; //this should probably be a DB later

const sessions: { [key: string]: Session } = {};  // TODO this should also be a DB later

io.on("connection", (socket) => {
    constructSession(socket);
    //createOrJoin(socket);
    if(activeUsers[socket.data.id].roomID){
        socket.join(activeUsers[socket.data.id].roomID);
        console.log("rejoining user" + socket.data.id + " to room " + activeUsers[socket.data.id].roomID)
    }
    updateUserState(io, activeUsers, socket.data.id, activeUsers[socket.data.id].roomID)

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.data.id} disconnected`);
    });
});
//TODO remove, only for testing
app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/index.html");
})

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
        const newUser: User = {socket};
        const newUserId = nextUserId++;
        const newSession: Session = {constructed: Date.now(), userid: newUserId};
        activeUsers[newUserId] = newUser;
        sessions[newToken] = newSession;
        socket.data.id = newUserId;
        socket.emit('construct-session', {token: newToken, userId: newUserId});
        console.log(`Created new user with id ${newUserId}`);
        activeUsers[socket.data.id].state = StateID.Home;
    }
}

//io.listen(port);
server.listen(3000)
