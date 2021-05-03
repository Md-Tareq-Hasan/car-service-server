const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c7nzy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const carsCollection = client.db("carshop").collection("cars");
    const ordersCollection = client.db("carshop").collection("ordersCollection");
    const reviewsCollection = client.db("carshop").collection("reviewsCollection");
   

    console.log("database connected");
    

    app.get('/cars', (req, res) => {
        carsCollection.find({})
            .toArray((err, items) => {
                res.send(items);
            })

    })
    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        carsCollection.insertOne(newEvent)
            .then(result => {
                console.log(result.insertedCount);
            })
        console.log('newEvent', newEvent);
    })

    app.get('/reviews', (req, res) => {
        reviewsCollection.find({})
            .toArray((err, items) => {
                res.send(items);
            })

    })

    app.post('/addReview', (req, res) => {
        const newEvent = req.body;
        reviewsCollection.insertOne(newEvent)
            .then(result => {
                console.log(result.insertedCount);
            })
        console.log('newEvent', newEvent);
    })

    

    app.post('/addBook', (req, res) => {
        const orders = req.body;
        console.log(orders);
        ordersCollection.insertOne(orders)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/oderbook', (req, res) => {
        ordersCollection.find({ email: req.query.email })
       
            .toArray((err, items) => {
                res.send(items);
            })

    })
    app.get('/ordercheck', (req, res) => {
        
        ordersCollection.find({})
            .toArray((err, items) => {
                res.send(items);
            })

    })

    app.delete('/delete/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        carsCollection.deleteOne({ _id: id })
            .then(result => {
                console.log(result);
            })
    })



});





app.get('/', (req, res) => {
    res.send("<h1>This Is Working</h1>")
})

app.listen(port)