module.exports = opts => require('pino-pretty')({
    ...opts,
    messageFormat: (log, messageKey) => {
        let message = `${log[messageKey]}`
        try {
            if (log.user.room) message = `[Room ${log.user.room.id}] ` + message
        }catch (e){
            //pass
        }
        if(log.room) message = `[Room ${log.room.id}] ` + message

        if(log.user) message = `[User ${log.user.id} "${log.user.username}"] ` + message

        return message
    }
})

//TODO Make this typescript