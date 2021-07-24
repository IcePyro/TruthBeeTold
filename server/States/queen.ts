import {getAllUserIDsInRoom} from "../helper-functions"
import {updateMultipleUserStates} from "./state-updater";
import {StateID} from "./state-updater";
import {Server} from 'socket.io';
import {User} from '../types/User';
import Room from '../types/Room';

exports.init = function (io: Server, activeUsers: {[key: number]: User}, userID, roomID){
    const room = Room.byId(roomID);

    io.to(roomID).emit('selectedarticle', activeUsers[getAllUserIDsInRoom(io, roomID).find(user => activeUsers[user].state === StateID.Bee)].articleID);
    const beeSelectListener = (selectedId: number) =>{
        const correct = activeUsers[selectedId].state === StateID.Bee;
        const actualBee = room.bee;
        console.log(`Bee selected. Correct: ${correct}. Selected: ${selectedId}. Actual Bee: ${actualBee.id}`)
        io.to(roomID).emit("beeselected", {queen: userID, selected: selectedId, bee: actualBee.id, correct});
        junctionUsers(io, activeUsers, roomID)
    }
    activeUsers[userID].socket.once("beeselect", beeSelectListener)
}
function generatePlayerList(io, activeUsers, roomID){
    return getAllUserIDsInRoom(io, roomID).filter((curr) =>{
        return activeUsers[curr].state !== StateID.Queen
    })
}
function junctionUsers(io, activeUsers, roomID){
    const userIDs = getAllUserIDsInRoom(io, roomID);

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
