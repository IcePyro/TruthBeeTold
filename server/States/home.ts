import {StateID, updateUserState} from "./state-updater";
import {activeUsers, User} from "../types/User";
import Room from "../types/Room";

exports.init = function (io, user: User){
    user.socket.once("createlobby", () => {
        user.socket.removeAllListeners("joinlobby");
        user.state = StateID.Settings
        updateUserState(io, user)
    })
    user.socket.on("joinlobby", (joinRoomID: string) => {
        user.socket.removeAllListeners("joinlobby");
        user.socket.removeAllListeners("createlobby");

        if (io.sockets.adapter.rooms.has(joinRoomID)) {
            user.socket.removeAllListeners("createlobby");
            user.socket.removeAllListeners("joinlobby");

            user.socket.rooms.clear();
            user.socket.join(joinRoomID);


            user.room = Room.byId(joinRoomID);
            user.state = StateID.Lobby
            updateUserState(io, user)
        } else {
            console.log("requested lobby not found");
            user.socket.emit("joinlobbysuccess", false);
        }
    })
}
