import {lobbysettings, LobbySettings} from "../index";
import {StateID, updateUserState} from "./state-updater";
import {User} from "../types/User";
import Room from "../types/Room";
import {Server} from "socket.io";

export default function(io: Server, user: User): void {
    user.socket.once("settings", (settings: LobbySettings)=>{
        const lobbyID = Room.newRoomID()
        user.socket.rooms.clear();
        user.socket.join(lobbyID);
        user.room = Room.byId(lobbyID);
        user.room.join(user.id)
        lobbysettings[lobbyID] = settings;

        user.state = StateID.Lobby;
        updateUserState(io, user);
    })
}
