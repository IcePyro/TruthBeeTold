//maps state names to state IDs
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
export function updateUserState(io, activeUsers, userID, roomID){
    console.log("transitioning user " + userID + " into state " + StateID[activeUsers[userID].state])
    activeUsers[userID].socket.emit("statetransition", activeUsers[userID].state)
    stateIDToInitFunction[activeUsers[userID].state](io, activeUsers, userID, roomID)
}
export function updateMultipleUserStates(io, activeUsers, userIDs, roomID){
    userIDs.forEach((curr) =>{
        exports.updateUserState(io, activeUsers, curr, roomID);
    })
}