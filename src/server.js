import { testAxios } from "../axiosClientTest.js";
import { exec } from 'child_process';
import { Server } from 'socket.io';
import * as os from 'os';
import * as messagesModel from "./models/messages.js";
import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import parseArgs from 'minimist';
import productosApiRouter from "./routers/products.js";
import cartsApiRouter from "./routers/carts.js";
import usersApiRouter from "./routers/users.js";
import messagesApiRouter from "./routers/messages.js";
import cors from 'cors';
import logger from "./logger.js";
import 'dotenv/config';

//Para chequear la ip asi trabajamos desde multiples dispositivos
let interfaces = os.networkInterfaces();
let addresses = [];
for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
const puerto = parseArgs(process.argv.slice(2));
const uri = puerto._.includes('staging') ? process.env.MONGO_CNXSTR_TEST : process.env.MONGO_CNXSTR

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 
    if ('OPTIONS' == req.method) {
        res.send(200);    
    }
    else {
        next();
    }
};

const app = express();

app.use(allowCrossDomain);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productosApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/api/users', usersApiRouter);
app.use('/api/messages', messagesApiRouter);
app.use(cors());
//Cliente de prueba con axios
if(puerto._.includes('test')){
    const productToTest = {
        title: "coca cola",
        description: "gaseosa de cola",
        code: 1001,
        photoUrl: "https://http2.mlstatic.com/D_NQ_NP_961625-MLA46350451480_062021-O.webp",
        price: 200,
        timestamp: Date.now(),
        stock: 10
    }
    const test = new testAxios();
    test.allProducts();
    test.productForId(1);
    test.newProduct( productToTest.title, productToTest.description, productToTest.code, productToTest.photoUrl, productToTest.price, productToTest.timestamp, productToTest.stock );
    test.updateForId( 1,productToTest );
    test.deleteProductForId( 2 );
    test.deleteAllProduct();    
}

if(puerto._[0] === "cluster")
{
    exec('pm2 start src/server.js -i 4', async (error, stdout, stderr) => {
        if (error) {
            logger.error(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            logger.warn(`stderr: ${stderr}`);
            return;
        }
        logger.info(`ejecutando servidor con cluster: ${stdout}`);
    });
}

export const connectedServer = app.listen(process.env.PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${connectedServer.address().port}`)
})

const io = new Server(connectedServer, {
    cors: {
        origin: "http://192.168.0.169:3000",
        methods: ["GET", "POST"]
    }
});
io.on("connection",  (socket) => {
    console.log("usuario conectado");
    socket.on('message', async (user) => {
        [mensaje] = await messagesModel.messages.find({author: user})
        io.emit("message", {
            msg: mensaje?.messages ?? ['No hay mensajes...']
        });
    } )
    socket.on('disconnect', () => {
        console.log('disconect')
    })

});


connectedServer.on('error', error => logger.error(`Error en el servidor ${error}`))

mongoose.connect(uri, config.mongoRemote.client);


