import { Router } from "express";
import logger from "../logger.js";
import mensajesApiMongo from "../daos/messages/messagesDaoMongo.js";
import 'dotenv/config';


const messages = mensajesApiMongo;
const messagesApiRouter = new Router();


messagesApiRouter.get('/chat/:email', async (req, res) => {
    try {
        res.json(await messages.listAllMessages(req.params.email))
    } catch (error) {
        logger.error(error)
        res.json({
            err: -1,
            message: error
        })
    }
})

messagesApiRouter.post('/chat', async (req, res) => {
    try {
        res.json(await messages.addNewMessage(req.body))
    } catch (error) {
        logger.error(error)
        res.json({
            err: -1,
            message: error
        })
    }
})

export default messagesApiRouter;