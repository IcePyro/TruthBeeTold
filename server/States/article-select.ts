const helper = require('../helper-functions')
const stateNameToID = require("./state-updater").stateNameToID
const updateUserState = require("./state-updater").updateUserState
const stateUpdater = require("./state-updater")

exports.init = function (io, activeUsers, userID, roomID){
    activeUsers[userID].state = 1
    const articleSelectListener = (articleID) => {
        if(articleID){
            activeUsers[userID].articleID = articleID;
            if(checkAllSocketsArticleLock(io, activeUsers, roomID)){
                junctionUsers(io, activeUsers, roomID)
            }
        }
    }
    activeUsers[userID].socket.once('lockinarticle', articleSelectListener)
}

function junctionUsers(io, activeUsers, roomID){
    const queenID = helper.selectRandomQueen(io, roomID).data.id;
    const beeID = helper.selectRandomBee(io, roomID, queenID).data.id;

    activeUsers[queenID].state = stateNameToID["queen"];
    activeUsers[beeID].state = stateNameToID["bee"];

    helper.getAllSocketIDsInRoom(io, roomID).filter((curr) =>{
        return !((curr == queenID) || (curr == beeID));
    }).forEach((curr) => {
        activeUsers[curr].state = stateNameToID["wasp"];
    })
    stateUpdater.updateMultipleUserStates(io, activeUsers, helper.getAllSocketIDsInRoom(io, roomID), roomID);
}

function checkAllSocketsArticleLock(io, activeUsers, roomID: string): boolean {
    return helper.getAllSocketsInRoom(io, roomID).every(curr => {
        return activeUsers[curr.data.id].articleID !== undefined;
    });
}