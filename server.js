console.log('Starting Server......');

const express = require('express');
const app = express();
// const MongoClient = require('mongodb').MongoClient

const port = process.env.PORT || 3000

// MongoClient.connect('link-to-mongodb', (err, database) => {
    // ... start the server
// })

app.listen(port, function (){
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    })

    app.post('/quotes', (req, res) => {
        console.log('Hellooooooooooooooooo!');
    })
});