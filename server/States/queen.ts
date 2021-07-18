import {getAllSocketIDsInRoom} from "../helper-functions"
import {updateMultipleUserStates} from "./state-updater";
import {StateID} from "./state-updater";

exports.init = function (io, activeUsers, userID, roomID){
    activeUsers[userID].socket.emit("playerlist", generatePlayerList(io, activeUsers, roomID));
    const beeSelectListener = (selectedID) =>{
        if(activeUsers[selectedID].state === StateID.Bee){
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
        return activeUsers[curr].state !== StateID.Queen
    })
}
function junctionUsers(io, activeUsers, roomID){
    const userIDs = getAllSocketIDsInRoom(io, roomID);

    userIDs.filter((curr) => {
        return activeUsers[curr].state !== StateID.Bee;
    }).forEach((curr) => {
        activeUsers[curr].state = StateID.Wait;
    })
    activeUsers[userIDs.find((curr) => {
        return activeUsers[curr].state === StateID.Bee;
    })].state = StateID.ArticleSelect

    updateMultipleUserStates(io, activeUsers, userIDs, roomID)
}