//maps state names to state IDs
import {activeUsers, User} from "../types/User";
import Room from "../types/Room";
import homeInit from "./home"
import settingsInit from "./settings"
import lobbyInit from "./lobby"
import articleSelectInit from "./article-select"
import queenInit from "./queen"
import beeInit from "./bee"
import waspInit from "./wasp"
import waitInit from "./wait"



export enum StateID {Home, Settings, Lobby,ArticleSelect, Queen, Bee, Wasp, Wait}


//maps state IDs to corresponding init function
export const stateIDToInitFunction = {
    [StateID.Home] : homeInit,
    [StateID.Settings] : settingsInit,
    [StateID.Lobby] : lobbyInit,
    [StateID.ArticleSelect] : articleSelectInit,
    [StateID.Queen] : queenInit,
    [StateID.Bee] : beeInit,
    [StateID.Wasp] : waspInit,
    [StateID.Wait] : waitInit
}
// transitions user with userID into state saved in activeUsers by calling the corresponding state init function
export function updateUserState(io, user: User): void{
    console.log("transitioning user " + user.username + " into state " + StateID[user.state])
    user.socket.emit("statetransition", user.state)
    stateIDToInitFunction[user.state](io, user)
}
export function updateMultipleUserStates(io, users: User[]): void{
    users.forEach((curr) =>{
        updateUserState(io, curr);
    })
}