import { Router } from "express";
import { graphqlHTTP } from 'express-graphql';
import productsApiMongo from "../daos/products/productsDaoMongo.js";
import logger from "../logger.js";
import pkg from 'graphql';
import 'dotenv/config';
const { buildSchema } = pkg;


const products = productsApiMongo; 
const productosApiRouter = new Router();

let Admin = true;
const schema = buildSchema(`
    type Productos {
        id: ID!
        title: String,
        description: String,
        code: Int,
        photoUrl: String,
        price: Int,
        timestamp: String,
        stock: Int
    }
    input ProductosInput {
        title: String,
        description: String,
        code: Int,
        photoUrl: String,
        price: Int,
        stock: Int
    }
    type Query {
        list(id: ID!): Productos,
        listAll: [Productos]
    }
    type Mutation {
        save(datos: ProductosInput): Productos,
        update(id: ID!, datos: ProductosInput): Productos,
        deleteOne(id: ID!): Productos,
        deleteAll: [Productos]
    }
`);

async function listAll() {
    try {
        return(await products.listAll())
    } catch (error) {
        return({
            err: -1,
            message: error
        })
    }
}

async function list({ id }) {
    try {
        return(await products.list(id))
    } catch (error) {
        return({
            err: -1,
            message: error
        })
    }
}

async function save({ datos }){
    if(Admin){
        try {
            return(await products.save(datos))
        } catch (error) {
            return({
                err: -1,
                message: error
            })
        }
    }
    else{
        return({
            err: -1,
            message: "ruta no autorizada"
        })
    }
}

async function update({ id, datos }){
    if(Admin){
        try {
            return(await products.update({ ...datos, id: id }))
        } catch (error) {
            logger.error(error)
            return({
                err: -1,
                message: error
            })
        }
    }
    else{
        return({
            err: -1,
            message: "ruta no autorizada"
        })
    }
}

async function deleteOne({ id }){
    if(Admin){
        try {
            return(await products.delete(id))
        } catch (error) {
            return({
                err: -1,
                message: error
            })
        }
    }
    else{
        return({
            err: -1,
            message: "ruta no autorizada"
        })
    }
}

async function deleteAll(){
    if(Admin){
        try {
            return(await products.deleteAll())
        } catch (error) {
            logger.error(error)
            return({
                err: -1,
                message: error
            })
        }
    }
    else{
        return({
            err: -1,
            message: "ruta no autorizada"
        })
    }
}

productosApiRouter.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: {
        listAll,
        list,
        save,
        update,
        deleteOne,
        deleteAll
    },
    graphiql: true,
}));


export default productosApiRouter;