//maps state names to state IDs
export enum StateID {ArticleSelect, Queen, Bee, Wasp, Wait}


//maps state IDs to corresponding init function
export const stateIDToInitFunction = {
    0 : require("./article-select").init,
    1 : require("./queen").init,
    2 : require("./bee").init,
    3 : require("./wasp").init,
    4 : require("./wait").init
}
// transitions user with userID into state saved in activeUsers by calling the corresponding state init function
export function updateUserState(io, activeUsers, userID, roomID){
    console.log("transitioning user " + userID + " into state " + activeUsers[userID].state)
    activeUsers[userID].socket.emit("statetransition", activeUsers[userID].state)
    stateIDToInitFunction[activeUsers[userID].state](io, activeUsers, userID, roomID)
}
export function updateMultipleUserStates(io, activeUsers, userIDs, roomID){
    userIDs.forEach((curr) =>{
        exports.updateUserState(io, activeUsers, curr, roomID);
    })
}