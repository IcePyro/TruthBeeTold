import {StateID} from "./state-updater";
import {io} from '../session';
import Room from '../types/Room';
import {User} from '../types/User';

const helper = require('../helper-functions')
const stateNameToID = require("./state-updater").stateNameToID
const updateUserState = require("./state-updater").updateUserState
const stateUpdater = require("./state-updater")

exports.init = function (_, activeUsers, userID, roomID){
    const room = Room.byId(roomID);
    const user = activeUsers[userID] as User;

    const articleSelectListener = (articleID) => {
        if(articleID){
            user.articleID = articleID;
            if(checkAllSocketsArticleLock(io, activeUsers, roomID)){
                junctionUsers(io, activeUsers, roomID)
            } else {
                room.emitAllWithout(user, 'lockedinarticle', userID);
            }
        }
    }
    activeUsers[userID].socket.once('lockinarticle', articleSelectListener)
}

function junctionUsers(io, activeUsers, roomID){
    const queenID = helper.selectRandomQueen(io, roomID).data.id;
    const beeID = helper.selectRandomBee(io, roomID, queenID).data.id;

    activeUsers[queenID].state = StateID.Queen;
    activeUsers[beeID].state = StateID.Bee;

    helper.getAllUserIDsInRoom(io, roomID).filter((curr) =>{
        return !((curr === queenID) || (curr === beeID));
    }).forEach((curr) => {
        activeUsers[curr].state = StateID.Wasp;
    })
    stateUpdater.updateMultipleUserStates(io, activeUsers, helper.getAllUserIDsInRoom(io, roomID), roomID);
}

function checkAllSocketsArticleLock(io, activeUsers, roomID: string): boolean {
    return helper.getAllSocketsInRoom(io, roomID).every(curr => {
        return activeUsers[curr.data.id].articleID !== undefined;
    });
}
