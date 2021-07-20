import {Socket} from "socket.io";



export const getAllSocketsInRoom = (io, roomID: string): Socket[] => {
    //Do not use this as a variable or to assign it to something, this is a temporary freezeframe.
    //if the sockets in the room change, the function return does not
    return Array.from(io.of("/").adapter.rooms.get(roomID)).map((socketID) => {
        return io.sockets.sockets.get(socketID);
    });
}
export const getAllUserIDsInRoom = (io, roomID) => {
    return exports.getAllSocketsInRoom(io, roomID).map((curr) => curr.data.id)
}
exports.selectRandomQueen = function (io, roomID) {
    const allSockets = exports.getAllSocketsInRoom(io, roomID);
    return allSockets[Math.floor(Math.random() * allSockets.length)];
}

exports.selectRandomBee = function (io, roomID, queenID) {
    const allSockets = exports.getAllSocketsInRoom(io, roomID);
    const allSocketsExceptQueen = allSockets.filter((curr) => {
        return !(curr.data.id === queenID);
    });
    return allSocketsExceptQueen[Math.floor(Math.random() * allSocketsExceptQueen.length)];
}
