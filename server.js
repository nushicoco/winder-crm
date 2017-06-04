console.log('Starting Server......');

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('link-to-mongodb', (err, database) => {
    // ... start the server
})

app.listen(3000, function (){
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    })

    app.post('/quotes', (req, res) => {
        console.log('Hellooooooooooooooooo!');
    })
});