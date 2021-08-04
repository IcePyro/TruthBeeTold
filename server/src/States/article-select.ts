import {StateID, updateMultipleUserStates} from "./state-updater";
import {io} from '../session';
import Room from '../types/Room';
import {activeUsers, User} from '../types/User';


export default function (_, user: User){
    const room = user.room;

    user.socket.emit('lockedstatusown', {
        status: getLockedArticleData(room)
    });

    const articleSelectListener = (articleID) => {
        if(articleID){
            user.articleID = articleID;
            if(user.room.allArticleLock){
                junctionUsers(io, room)
            } else {
                user.room.emitAll('lockedstatus', getLockedArticleData(room));
            }
        }
    }
    user.socket.once('lockinarticle', articleSelectListener)
}

function getLockedArticleData(room: Room): Array<{userid: number, hasArticle: boolean}> {
    return room.users.map(user => ({userid: user.id, hasArticle: user.articleID !== undefined}));
}

function junctionUsers(io, room: Room){
    const queen = room.newQueen();
    queen.state = StateID.Queen;
    const bee = room.newBee();
    bee.state = StateID.Bee

    room.usersWithout(queen, bee).forEach((curr) => {
        curr.state = StateID.Wasp;
    })
    updateMultipleUserStates(io, room.users);
}


