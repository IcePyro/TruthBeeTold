import {getAllSocketIDsInRoom} from "../helper-functions"
import {updateMultipleUserStates} from "./state-updater";
import {stateNameToID} from "./state-updater";

exports.init = function (io, activeUsers, userID, roomID){
    activeUsers[userID].socket.emit("playerlist", generatePlayerList(io, activeUsers, roomID));
    const beeSelectListener = (selectedID) =>{
        if(activeUsers[selectedID].state == stateNameToID["bee"]){
            console.log("beecorrect");
            io.to(roomID).emit("beecorrect");
        }else{
            console.log("beefalse");
            io.to(roomID).emit("beefalse");
        }
        junctionUsers(io, activeUsers, roomID)
    }
    activeUsers[userID].socket.once("beeselect", beeSelectListener)
}
function generatePlayerList(io, activeUsers, roomID){
    return getAllSocketIDsInRoom(io, roomID).filter((curr) =>{
        return activeUsers[curr].state !== stateNameToID["queen"]
    })
}
function junctionUsers(io, activeUsers, roomID){
    const userIDs = getAllSocketIDsInRoom(io, roomID);

    userIDs.filter((curr) => {
        return activeUsers[curr].state !== stateNameToID["bee"];
    }).forEach((curr) => {
        activeUsers[curr].state = stateNameToID["wait"];
    })
    activeUsers[userIDs.find((curr) => {
        return activeUsers[curr].state == stateNameToID["bee"];
    })].state = stateNameToID["articleselect"]

    updateMultipleUserStates(io, activeUsers, userIDs, roomID)
}