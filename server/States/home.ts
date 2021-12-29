import {StateID, updateUserState} from "./state-updater";
import {User} from "../types/User";
import Room from "../types/Room";
import {Server} from "socket.io";
import logger from "../logger/logger";

export default function (io: Server, user: User): void{
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
            user.room.join(user.id)
            user.state = StateID.Lobby
            updateUserState(io, user)
        } else {
            logger.logUser(`Tried to join an non-existent lobby with id "${joinRoomID}"`, user);
            user.socket.emit("joinlobbysuccess", false);
        }
    })
}
