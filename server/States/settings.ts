import {lobbysettings, LobbySettings} from "../index";
import {StateID, updateUserState} from "./state-updater";
import {User} from "../types/User";
import Room from "../types/Room";

let lobbyCounter = 0;

export default function(io, user: User){
    user.socket.once("settings", (settings: LobbySettings)=>{
        const lobbyID = generateNextLobbyID();
        user.socket.rooms.clear();
        user.socket.join(lobbyID);
        user.room = Room.byId(lobbyID);
        user.room.join(user.id)
        lobbysettings[lobbyID] = settings;

        user.state = StateID.Lobby;
        updateUserState(io, user);
    })
}
function generateNextLobbyID(): string {
    //TODO: Hash lobby id

    lobbyCounter += 1;
    console.log("new lobby id created: " + lobbyCounter);
    return lobbyCounter.toString();
}