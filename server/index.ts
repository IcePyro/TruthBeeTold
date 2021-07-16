import * as express from 'express';
import * as http from 'http';
import { Server, Socket } from "socket.io";

const port = parseInt(process.env.PORT || '3000');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT ||'http://localhost:1234'
    }
});

interface User {
    ready?: boolean;
    articleID?: string;
    socket?: Socket;
    username?: string;
}

interface LobbySettings {
  any // TODO specify
}

const activeUsers: {[key: number]: User} = {}; //this should probably be a DB later
let lobbyCounter = 0;
const lobbysettings: {[key: string]: LobbySettings} = {}; //this should probably be a DB later

io.on("connection", (socket) => {
    socket.emit("requestid");
    console.log("new user connected, requesting id");
    socket.once("id", (id: number) =>{
        //on request ID the connected socket should submit an unique identifier. this is to be able to
        //reconnect and identify users that reload their page etc. otherwise user specific information
        //would be connected only to their socket, so reloading the page would make the server think
        //that a completly new user has connected
        socket.data.id = id; //this connects the id to the current socket, so it is easy to fetch data from the DB
        activeUsers[socket.data.id] = {socket: socket};
        console.log("id sent by new user: " + id);
        createOrJoin(socket)
    })
});
function createOrJoin(socket: Socket) {
    socket.once("createlobby", (username) => {
        console.log("user with id: '" + socket.data.id + "' is creating a new lobby");
        activeUsers[socket.data.id].username = username; //TODO emit error if username is empty
        socket.removeAllListeners("joinlobby");
        socket.emit("requestsettings");
        socket.once("settings", (settings: LobbySettings) =>{
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
    socket.on("joinlobby", (lobbyid: string, username) => {
        console.log("user with id: '" + socket.data.id + "' is trying to join lobby with the lobbyid: '" + lobbyid + "'");
        if(io.sockets.adapter.rooms.has(lobbyid)){
            activeUsers[socket.data.id].username = username; //TODO emit error if username is empty
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
            const allSocketsReady = checkAllSocketsArticleLock(roomID);
            console.log("socket "+ socket.data.id + " has locked in the article " + articleID)
            if(allSocketsReady){
                getAllSocketsInRoom(roomID).forEach((curr) =>{
                    curr.removeAllListeners("lockinarticle")
                })
                selectQueenGL(roomID);
            }
        })
    })
}

function selectQueenGL(roomID){
    const queenID = selectRandomQueen(roomID).data.id;
    const beeID = selectRandomBee(roomID, queenID).data.id
    console.log("The chosen queen is: " + queenID)
    console.log("The chosen bee is: " + beeID)
    console.log("The article of the bee is: " +  activeUsers[beeID].articleID)
    io.to(roomID).emit("roundstart", activeUsers[beeID].articleID);
    const playerListWithBee = getPlayerListWithBee(roomID, queenID);
    console.log(playerListWithBee)
    activeUsers[beeID].socket.emit("playerList", playerListWithBee.map((tuple) =>{
        return tuple[1]
    }))
    activeUsers[queenID].socket.once("beeselect", (selectedIndex) => {
        const beeIndex = playerListWithBee.findIndex((curr) => curr[0] == beeID)
        if(selectedIndex == beeIndex){
            io.to(roomID).emit("beecorrect")
            console.log("correct bee")
        }else{
            io.to(roomID).emit("beefalse")
            console.log("that was a wasp")
        }
        newBeeArticleGL(roomID, beeID)
    })
}

function newBeeArticleGL(roomID, beeID){
    activeUsers[beeID].socket.on("lockinarticle", (articleID: string)=>{
        activeUsers[beeID].articleID = articleID;
        const allSocketsReady = checkAllSocketsArticleLock(roomID);
        console.log("socket "+ beeID + " has locked in the article " + articleID)
        if(allSocketsReady){
            getAllSocketsInRoom(roomID).forEach((curr) =>{
                curr.removeAllListeners("lockinarticle")
            })
            selectQueenGL(roomID);
        }
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
function selectRandomQueen(roomID){
    const allSockets = getAllSocketsInRoom(roomID);
    return allSockets[Math.floor(Math.random()*allSockets.length)]
}
function selectRandomBee(roomID, queenID){
    const allSockets = getAllSocketsInRoom(roomID);
    const allSocketsExceptQueen = allSockets.filter((curr) => {
        return !(curr.data.id == queenID)
    })
    return allSocketsExceptQueen[Math.floor(Math.random()*allSocketsExceptQueen.length)]
}
function getPlayerListWithBee(roomID, queenID){
    return getAllSocketsInRoom(roomID)
        .filter((curr)=> {
            return !(curr.data.id == queenID)
        })
        .map((curr) => {
        return [curr.data.id, curr.data.username]
    })
}

io.listen(port);
