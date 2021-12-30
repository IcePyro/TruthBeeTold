import * as fs from 'fs';
import * as pinoms from "pino-multi-stream";

const prettyStream = pinoms.prettyStream({
    prettyPrint:
        {
            colorize: true,
            translateTime: "SYS:dd.mm.yyyy HH:MM:ss",
            ignore: "hostname,user,room",
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
        },

})

const streams = [
    {stream: fs.createWriteStream('./logs/info.tbt.json') }, //TODO log filei s missing "top-level" json format
    {stream: prettyStream }
]

const logger = pinoms(pinoms.multistream(streams))


logger.logUser = (msg, user) => {
    logger.info({
        msg: msg,
        user: user
    })
}

logger.logRoom = (msg, room) => {
    logger.info({
        msg: msg,
        room: room
    })
}

export  default logger