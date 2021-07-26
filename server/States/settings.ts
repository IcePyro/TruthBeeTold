import {lobbysettings, LobbySettings} from "../index";
import {StateID, updateUserState} from "./state-updater";

let lobbyCounter = 0;

export function init(io, activeUsers, userID, roomID){
    activeUsers[userID].socket.once("settings", (settings: LobbySettings)=>{
        const lobbyID = generateNextLobbyID();
        activeUsers[userID].socket.rooms.clear();
        activeUsers[userID].socket.join(lobbyID);
        activeUsers[userID].roomID = lobbyID;
        lobbysettings[lobbyID] = settings;

        activeUsers[userID].state = StateID.Lobby;
        updateUserState(io, activeUsers, userID, lobbyID);
    })
}
function generateNextLobbyID(): string {
    //TODO: Hash lobby id

    lobbyCounter += 1;
    console.log("new lobby id created: " + lobbyCounter);
    return lobbyCounter.toString();
}