import {StateID, updateMultipleUserStates} from "./state-updater";
import {io} from '../session';
import Room from '../types/Room';
import {activeUsers, User} from '../types/User';


exports.init = function (_, user: User){
    const room = user.room;

    const articleSelectListener = (articleID) => {
        if(articleID){
            user.articleID = articleID;
            if(user.room.allArticleLock){
                junctionUsers(io, room)
            } else {
                room.emitAllWithout(user, 'lockedinarticle', user.id);
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
    updateMultipleUserStates(io, room.users);
}


