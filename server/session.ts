import {Server} from 'socket.io';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import {Express} from 'express';
import * as fs from 'fs';
import logger from './logger/logger';

require("dotenv").config();


function createServerDevelop(app: Express) {
    return http.createServer(app);
}

function createServerProduction(app: Express) {
    const options = getCertOptions()
    return https.createServer(options, app);
}

const isProduction = process.env.NODE_ENV === 'production';

function init(): Server {
    getCertOptions()
    const port = parseInt(process.env.PORT || '3000');
    const app = express();
    const server = isProduction ? createServerProduction(app) : createServerDevelop(app);
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT || 'http://localhost:1234'
        }
    });
    server.listen(port);
    logger.info(`Server is running on port: ${port}, is production: ${isProduction}`)

    return io;
}

export const io = init();

function getCertOptions() {

    try{
        const cert = fs.readdirSync('./').filter(
            value => value.startsWith('fullchain')).sort().pop()
        const key = fs.readdirSync('./').filter(
            value => value.startsWith('privkey')).sort().pop()
        return {
            key:key,
            cert:cert
        }

    }catch(e){
        return {
            key: fs.readFileSync(process.env.KEYLOCATION),
            cert: fs.readFileSync(process.env.CERTLOCATION)
        }
    }
}