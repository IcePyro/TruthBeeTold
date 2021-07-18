//maps state names to state IDs
export const stateNameToID = {
    "articleselect": 1,
    "queen": 2,
    "bee": 3,
    "wasp": 4,
    "wait": 5
}
//maps state IDs to corresponding init function
export const stateIDToInitFunction = {
    1: require("./article-select").init,
    2: require("./queen").init,
    3: require("./bee").init,
    4: require("./wasp").init,
    5: require("./wait").init
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
};