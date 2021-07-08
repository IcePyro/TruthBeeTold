const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var activeUsers = new Map()
var lobbyCounter = 0
var lobbysettings = new Map()

app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/index.html");
})

io.on("connection", (socket) => {
    socket.emit("requestid")
    console.log("new user connected, requesting id")
    socket.once("id", (id) =>{
        socket.data.id = id;
        activeUsers[socket.data.id] = {}
        console.log("id sent by new user: " + id)
        createOrJoin(socket)
    })
})
function createOrJoin(socket){
    socket.once("createlobby", () => {
        console.log("user with id: '" + socket.data.id + "' is creating a new lobby")
        socket.removeAllListeners("joinlobby")
        socket.emit("requestsettings")
        socket.once("settings", (settings) =>{
            const lobbyID = generateNextLobbyID()
            socket.rooms.clear()
            socket.join(lobbyID)
            console.log(socket.rooms)
            lobbysettings[lobbyID] = settings
            lobby(socket)
        })
    })
    socket.on("joinlobby", (lobbyid)=>{
        console.log("user with id: '" + socket.data.id + "' is trying to join lobby with the lobbyid: '" + lobbyid + "'")
        if(io.sockets.adapter.rooms.has(lobbyid)){
            socket.removeAllListeners("createlobby")
            socket.removeAllListeners("joinlobby")
            socket.rooms.clear()
            socket.join(lobbyid)
            lobby(socket)
        }else{
            console.log("requested lobby not found")
            socket.emit("lobbynotfound")
        }

    })
}

function lobby(socket){
    activeUsers[socket.data.id]["ready"] = false
    console.log("socket joined lobby: " + socket.rooms.keys().next().value)
    console.log(lobbysettings)
    socket.on("toggleready",()=>{
        activeUsers[socket.data.id]["ready"] = !(activeUsers[socket.data.id]["ready"])
        console.log("user " + socket.data.id + " ready: " + activeUsers[socket.data.id]["ready"])

        //TODO Add check for atleast 3 Sockets, as that is the minimum required amount of players
        const roomID = socket.rooms.keys().next().value;
        let allSocketsReady = checkAllSocketsReady(roomID);
        console.log(allSocketsReady);
        if(allSocketsReady){
            startRoom(roomID);
        }
    })
}

function startRoom(roomID){
    io.to(roomID).emit("gamestart")
    console.log("starting room: "+ roomID)
    getAllSocketsInRoom(roomID).forEach((socket) =>{
        activeUsers[socket.data.id]["articleID"] = undefined
        console.log("adding listener for article lock in for socket: " + socket.data.id)
        socket.on("lockinarticle", (articleID)=>{
            activeUsers[socket.data.id]["articleID"] = articleID
            console.log("socket "+ socket.data.id + " has locked in the article " + articleID)
        })
    })
}

//HELPER FUNCTIONS

function generateNextLobbyID(){
    //TODO: Hash lobby id
    lobbyCounter += 1
    console.log("new lobby id created: " + lobbyCounter)
    return lobbyCounter.toString()
}
function checkAllSocketsReady(roomID){
    //TODO clean up this mess. very messy way of checking if all users are ready
    return getAllSocketsInRoom(roomID).reduce((acc, curr) =>
    {return (acc && activeUsers[curr.data.id]["ready"])}, true);
}
function getAllSocketsInRoom(roomID){
    //Do not use this as a variable or assign it to something, this is a temporary freezeframe.
    //if the sockets in the room change, the function return does not
    return Array.from(io.of("/").adapter.rooms.get(roomID)).map((socketID) => {
        return io.sockets.sockets.get(socketID);
    });
}
server.listen(3000)