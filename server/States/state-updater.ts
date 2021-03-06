//maps state names to state IDs
import {User} from "../types/User";
import homeInit from "./home"
import settingsInit from "./settings"
import lobbyInit from "./lobby"
import articleSelectInit from "./article-select"
import queenInit from "./queen"
import beeInit from "./bee"
import waspInit from "./wasp"
import waitInit from "./wait"
import {Server} from "socket.io";
import logger from "../logger/logger";



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
export function updateUserState(io: Server, user: User): void{
    logger.logUser(`Transitioning to State "${StateID[user.state]}"`, user)
    user.socket.emit("statetransition", user.state)
    stateIDToInitFunction[user.state](io, user)
}
export function updateMultipleUserStates(io: Server, users: User[]): void{
    users.forEach((curr) =>{
        updateUserState(io, curr);
    })
}