import {Server} from 'socket.io';
import * as express from 'express';
import * as http from 'http';

require("dotenv").config();

/*const options = {
    key: fs.readFileSync(process.env.KEYLOCATION),
    cert: fs.readFileSync(process.env.CERTLOCATION)
}*/


function init(): Server {
    const port = parseInt(process.env.PORT || '3000');
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT || 'http://localhost:1234'
        }
    });
    server.listen(port);
    console.log('Server is running');
    return io;
}


//const server = https.createServer(options, app)
//console.log("options-key:" + options.key)
//console.log("key: " + process.env.KEYLOCATION)

export const io = init();
