import {getAllUserIDsInRoom} from "../helper-functions"
import {updateMultipleUserStates} from "./state-updater";
import {StateID} from "./state-updater";
import {Server} from 'socket.io';
import {activeUsers, User} from '../types/User';
import Room from '../types/Room';

export default function (io, user: User){
    io.to(user.room.id).emit('selectedarticle', user.room.bee.articleID);
    const beeSelectListener = (selectedId: number) =>{
        const correct = activeUsers[selectedId].state === StateID.Bee;
        const actualBee = user.room.bee;
        console.log(`Bee selected. Correct: ${correct}. Selected: ${selectedId}. Actual Bee: ${actualBee.id}`)
        io.to(user.room.id).emit("beeselected", {queen: user.id, selected: selectedId, bee: actualBee.id, correct});
        junctionUsers(io, user.room)
    }
    user.socket.once("beeselect", beeSelectListener)
}

function junctionUsers(io, room: Room){
    const users = room.usersWithout(room.bee)

    users.forEach((curr) => {
        curr.state = StateID.Wait;
    })
    room.bee.state = StateID.ArticleSelect

    updateMultipleUserStates(io, room.users)
}
