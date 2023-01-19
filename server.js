import express from 'express'
import {connectToServer, getDb} from "./mongo";
import {ObjectId} from "mongodb";


const app = express()
const port = 3000

app.listen(port)

const products = "products"

connectToServer(() => {
    console.log("ok")
})

app.get('/products', (req, res) => {
    getDb().collection(products).find({}).toArray().then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.post('/products/create/:name/:price/:quantity', (req, res) => {
    const name = req.params.name
    const price = req.params.price
    const quantity = req.params.quantity

    const obj = {
        name: name,
        price: price,
        quantity: quantity
    }

    getDb().collection(products).insertOne(obj).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.put('/products/:id', (req, res) => {
    const id = req.params.id
    const price = req.query.price
    const name = req.query.name
    const quantity = req.query.quantity

    if(price){
        getDb().collection(products).updateOne({_id: new ObjectId(id)}, {$set: {price: price}})
    }

    if(name){
        getDb().collection(products).updateOne({_id: new ObjectId(id)}, {$set: {name: name}})
    }

    if(quantity){
        getDb().collection(products).updateOne({_id: new ObjectId(id)}, {$set: {quantity: quantity}})
    }
    res.send("Updated")
})

app.delete('/products/:id', (req, res) =>{
    const id = req.params.id

    getDb().collection(products).deleteOne({_id: new ObjectId(id)}).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.get('/products/generateReport', (req, res) => {
    getDb().collection(products).aggregate([
        {
            $group: { _id: "$name", ilosc: 1, wartosc: {$multiply: [ "$price", "$quantity" ]}}
        }
    ]).toArray().then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(500).send(err)
    })
})


