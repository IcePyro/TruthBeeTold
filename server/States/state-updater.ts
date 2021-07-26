//maps state names to state IDs
import {activeUsers, User} from "../types/User";
import Room from "../types/Room";

export enum StateID {Home, Settings, Lobby,ArticleSelect, Queen, Bee, Wasp, Wait}


//maps state IDs to corresponding init function
export const stateIDToInitFunction = {
    [StateID.Home] : require('./home').init,
    [StateID.Settings] : require("./settings").init,
    [StateID.Lobby] : require("./lobby").init,
    [StateID.ArticleSelect] : require("./article-select").init,
    [StateID.Queen] : require("./queen").init,
    [StateID.Bee] : require("./bee").init,
    [StateID.Wasp] : require("./wasp").init,
    [StateID.Wait] : require("./wait").init
}
// transitions user with userID into state saved in activeUsers by calling the corresponding state init function
export function updateUserState(io, user: User): void{
    console.log("transitioning user " + user.username + " into state " + StateID[user.state])
    user.socket.emit("statetransition", user.state)
    stateIDToInitFunction[user.state](io, user)
}
export function updateMultipleUserStates(io, users: User[]): void{
    users.forEach((curr) =>{
        exports.updateUserState(io, activeUsers, curr);
    })
}