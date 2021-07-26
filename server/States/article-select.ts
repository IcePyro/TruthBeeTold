import {StateID} from "./state-updater";
import {io} from '../session';
import Room from '../types/Room';
import {activeUsers, User} from '../types/User';

const helper = require('../helper-functions')
const stateNameToID = require("./state-updater").stateNameToID
const updateUserState = require("./state-updater").updateUserState
const stateUpdater = require("./state-updater")

exports.init = function (_, user: User){
    const room = user.room;

    const articleSelectListener = (articleID) => {
        if(articleID){
            user.articleID = articleID;
            if(user.room.allArticleLock){
                junctionUsers(io, activeUsers, room)
            } else {
                room.emitAllWithout(user, 'lockedinarticle', userID);
            }
        }
    }
    user.socket.once('lockinarticle', articleSelectListener)
}

function junctionUsers(io, room: Room){
    const queen = room.newQueen;
    const bee = room.newBee;

    queen.state = StateID.Queen;
    bee.state = StateID.Bee;

    room.usersWithout([queen, bee]).forEach((curr) => {
        curr.state = StateID.Wasp;
    })
    stateUpdater.updateMultipleUserStates(io, room.users);
}


