const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
    socket.on('adduser', (name) =>{
        socket.username = name;
        console.log(name);
    })
})

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', socket.username + msg);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});