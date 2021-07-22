import {StateID, updateUserState} from "./state-updater";

exports.init = function (io, activeUsers, userID, roomID){
    activeUsers[userID].socket.once("createlobby", () => {
        activeUsers[userID].socket.removeAllListeners("joinlobby");
        activeUsers[userID].state = StateID.Settings
        updateUserState(io, activeUsers, userID, roomID)
    })
    activeUsers[userID].socket.on("joinlobby", (joinRoomID: string) => {
        activeUsers[userID].socket.removeAllListeners("joinlobby");
        activeUsers[userID].socket.removeAllListeners("createlobby");

        if (io.sockets.adapter.rooms.has(joinRoomID)) {
            activeUsers[userID].socket.removeAllListeners("createlobby");
            activeUsers[userID].socket.removeAllListeners("joinlobby");

            activeUsers[userID].socket.rooms.clear();
            activeUsers[userID].socket.join(joinRoomID);

            activeUsers[userID].socket.emit("joinlobbysuccess", true);
            activeUsers[userID].socket.state = StateID.Lobby
            updateUserState(io, activeUsers, userID, joinRoomID)
        } else {
            console.log("requested lobby not found");
            activeUsers[userID].socket.emit("joinlobbysuccess", false);
        }
    })
}