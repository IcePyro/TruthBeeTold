import pino from 'pino';
import * as fs from 'fs';
import * as pinoms from "pino-multi-stream";

const consoleStream = {
    transport:{
        target: "./pino-pretty-transport",
        options: {
            colorize: true,
            translateTime: "SYS:dd.mm.yyyy HH:MM:ss",
            ignore: "hostname,user,room"
        }
    }
}

const prettyStream = pinoms.prettyStream({
    prettyPrint:
        {
            colorize: true,
            translateTime: "SYS:dd.mm.yyyy HH:MM:ss",
            ignore: "hostname,user,room"
        }
})

const streams = [
    {stream: fs.createWriteStream('my.log') },
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