import mongoose from "mongoose";

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    author: {
        type: String, 
        require: true, 
        max: 50,
    },
    messages: {
        type: Array, 
        require: true, 
    },
})

export const messages = mongoose.model(messagesCollection, messagesSchema);