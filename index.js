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

    })
}

function checkAllSocketsReady(socket){
    //const ready = socket.rooms.
}

function generateNextLobbyID(){
    //TODO: Hash lobby id
    lobbyCounter += 1
    console.log("new lobby id created: " + lobbyCounter)
    return 42
}

server.listen(3000)