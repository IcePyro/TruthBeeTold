import pino from 'pino';

const logger = pino({
    transport:{
        target: "./pino-pretty-transport",
        options: {
            colorize: true,
            translateTime: "SYS:dd.mm.yyyy HH:MM:ss",
            ignore: "hostname,user,room"
        }
    }
})

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