import {lobbysettings} from "../index";
import {getAllUserIDsInRoom} from "../helper-functions";
import {StateID, updateUserState} from "./state-updater";

export function init(io, activeUsers, userID, roomID){
    activeUsers[userID].ready = false;
    console.log("socket joined lobby: " + roomID);
    console.log(lobbysettings);
    activeUsers[userID].socket.emit('youridandlobby', {id: userID, lobbyId: roomID});
    activeUsers[userID].socket.on("toggleready", () => {
        activeUsers[userID].ready = !activeUsers[userID].ready;
        console.log("user " + userID + " ready: " + activeUsers[userID].ready);
        const allSocketsReady = checkAllSocketsReady(io,activeUsers, roomID);
        console.log("All sockets in room " + roomID + "ready:" + allSocketsReady);
        if (allSocketsReady) {
            getAllUserIDsInRoom(io, roomID).forEach((curr) => {
                activeUsers[curr].state = StateID.ArticleSelect
                updateUserState(io, activeUsers, curr, roomID)
            })
        }
    });
}
function checkAllSocketsReady(io,activeUsers, roomID: string): boolean {
    //TODO Add check for atleast 3 Sockets, as that is the minimum required amount of players
    const allUserIDs = getAllUserIDsInRoom(io, roomID);
    return (allUserIDs.every(curr => {return activeUsers[curr].ready;}) && allUserIDs.size >= 3);
}