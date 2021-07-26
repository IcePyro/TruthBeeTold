import {StateID, updateMultipleUserStates} from "./state-updater";
import {io} from '../session';
import Room from '../types/Room';
import {activeUsers, User} from '../types/User';


export default function (_, user: User){
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
    const queen = room.newQueen();
    queen.state = StateID.Queen;
    const bee = room.newBee();
    bee.state = StateID.Bee

    room.usersWithout([queen, bee]).forEach((curr) => {
        curr.state = StateID.Wasp;
    })
    updateMultipleUserStates(io, room.users);
}


