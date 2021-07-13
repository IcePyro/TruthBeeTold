import * as express from 'express';
import * as http from 'http';
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

interface User {
    ready?: boolean;
    articleID?: string;
}

interface LobbySettings {
  any // TODO specify
}

const activeUsers: {[key: number]: User} = {}; //this should probably be a DB later
let lobbyCounter = 0;
const lobbysettings: {[key: string]: LobbySettings} = {}; //this should probably be a DB later

app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/index.html");
    //TODO this should later be unnecessary, and be replaced by a single page application or a mobile app
});

io.on("connection", (socket) => {
    socket.emit("requestid");
    console.log("new user connected, requesting id");
    socket.once("id", (id: number) =>{
        //on request ID the connected socket should submit an unique identifier. this is to be able to
        //reconnect and identify users that reload their page etc. otherwise user specific information
        //would be connected only to their socket, so reloading the page would make the server think
        //that a completly new user has connected
        socket.data.id = id; //this connects the id to the current socket, so it is easy to fetch data from the DB
        activeUsers[socket.data.id] = {};
        console.log("id sent by new user: " + id);
        createOrJoin(socket)
    })
});
function createOrJoin(socket: Socket) {
    socket.once("createlobby", () => {
        console.log("user with id: '" + socket.data.id + "' is creating a new lobby");
        socket.removeAllListeners("joinlobby");
        socket.emit("requestsettings");
        socket.once("settings", (settings: LobbySettings) =>{
            //this information should be in a map, as (String, String) key-value-pairs.
            //it should contain atleast max players and article read time.
            //possible future settings: category of articles, language of articles, gamemodes
            //e.g. chance no one has read the article, teams
            const lobbyID = generateNextLobbyID();
            socket.rooms.clear();
            socket.join(lobbyID);
            console.log(socket.rooms);
            lobbysettings[lobbyID] = settings;
            lobby(socket)
        })
    });
    socket.on("joinlobby", (lobbyid: string) => {
        console.log("user with id: '" + socket.data.id + "' is trying to join lobby with the lobbyid: '" + lobbyid + "'");
        if(io.sockets.adapter.rooms.has(lobbyid)){
            socket.removeAllListeners("createlobby");
            socket.removeAllListeners("joinlobby");
            socket.rooms.clear();//socket is always in a room with its own socketID. this just removes
                                 //it, so it only is in a lobby with itself
            socket.join(lobbyid);
            lobby(socket)
        }else{
            console.log("requested lobby not found");
            socket.emit("lobbynotfound")
        }

    })
}

function lobby(socket: Socket) {
    activeUsers[socket.data.id].ready = false;
    console.log("socket joined lobby: " + socket.rooms.keys().next().value);
    console.log(lobbysettings);
    socket.on("toggleready",() => {
        activeUsers[socket.data.id].ready = !activeUsers[socket.data.id].ready;
        console.log("user " + socket.data.id + " ready: " + activeUsers[socket.data.id].ready);
        const roomID = socket.rooms.keys().next().value;
        const allSocketsReady = checkAllSocketsReady(roomID);
        console.log(allSocketsReady);
        if(allSocketsReady){
            startRoom(roomID);
        }
    })
}

function startRoom(roomID: string){
    io.to(roomID).emit("gamestart");
    console.log("starting room: "+ roomID);
    getAllSocketsInRoom(roomID).forEach((socket) => {
        //TODO remove lockin listeners
        activeUsers[socket.data.id].articleID = undefined;
        console.log("adding listener for article lock in for socket: " + socket.data.id);
        //TODO Article lockin should be time limited
        socket.on("lockinarticle", (articleID: string)=>{
            activeUsers[socket.data.id].articleID = articleID;
            checkAllSocketsArticleLock(roomID);
            console.log("socket "+ socket.data.id + " has locked in the article " + articleID)
        })
    })
}

//HELPER FUNCTIONS

function generateNextLobbyID(): string {
    //TODO: Hash lobby id
    lobbyCounter += 1;
    console.log("new lobby id created: " + lobbyCounter);
    return lobbyCounter.toString()
}
function checkAllSocketsReady(roomID: string): boolean {
    //TODO Add check for atleast 3 Sockets, as that is the minimum required amount of players
    return getAllSocketsInRoom(roomID).every(curr => {
        return activeUsers[curr.data.id].ready
    });
}
function getAllSocketsInRoom(roomID: string): Socket[] {
    //Do not use this as a variable or to assign it to something, this is a temporary freezeframe.
    //if the sockets in the room change, the function return does not
    return Array.from(io.of("/").adapter.rooms.get(roomID)).map((socketID) => {
        return io.sockets.sockets.get(socketID);
    });
}
function checkAllSocketsArticleLock(roomID: string): boolean {
    return getAllSocketsInRoom(roomID).every(curr => {
        return activeUsers[curr.data.id].articleID !== undefined;
    });
}

server.listen(3000);
