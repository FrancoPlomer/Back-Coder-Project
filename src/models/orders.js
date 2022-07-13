import mongoose from "mongoose";

const ordersCollection = 'orders';

const ordersSchema = new mongoose.Schema({
    id: {
        type: Number, 
        require: true, 
        max: 500,
    },
    email: {
        type: String, 
        require: true, 
    },
    state: {
        type: String, 
        require: true, 
    },
    timestamp: {
        type: Number, 
        require: true, 
    },
    products: {
        type: Array, 
        require: true, 
    },
})

export const orders = mongoose.model(ordersCollection, ordersSchema);