import {StateID, updateMultipleUserStates} from "./state-updater";
import {io} from '../session';
import Room from '../types/Room';
import {User} from '../types/User';
import {Server} from "socket.io";
import logger from "../logger/logger";


export default function (_: Server, user: User): void {
    const room = user.room;

    user.socket.emit('lockedstatusown', {
        status: getLockedArticleData(room)
    });

    const articleSelectListener = (articleID) => {
        if (articleID) {
            articleID = articleID.toString()
            user.articleID = articleID;
            logger.logUser(`Selected article: ${articleID}`)
            if (user.room.allArticleLock) {
                junctionUsers(io, room)
            } else {
                user.room.emitAll('lockedstatus', getLockedArticleData(room));
            }
        }
    }
    user.socket.once('lockinarticle', articleSelectListener)
}

function getLockedArticleData(room: Room): Array<{ userid: number, hasArticle: boolean }> {
    return room.users.map(user => ({userid: user.id, hasArticle: user.articleID !== undefined}));
}

function junctionUsers(io, room: Room) {
    logger.logRoom('All articles selected, junctioning', room)
    const queen = room.newQueen();
    queen.state = StateID.Queen;
    const bee = room.newBee();
    bee.state = StateID.Bee

    room.usersWithout(queen, bee).forEach((curr) => {
        curr.state = StateID.Wasp;
    })
    updateMultipleUserStates(io, room.users);
}


