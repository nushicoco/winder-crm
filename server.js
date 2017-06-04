console.log('Starting Server......');

const express = require('express');
const app = express();
// const MongoClient = require('mongodb').MongoClient

const port = process.env.PORT || 3000

// MongoClient.connect('link-to-mongodb', (err, database) => {
    // ... start the server
// })

app.listen(port, function (){

    var pg = require('pg');

    app.get('/db', function (request, response) {
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT * FROM test_table', function(err, result) {
                done();
                if (err)
                { console.error(err); response.send("Error " + err); }
                else
                { response.render('pages/db', {results: result.rows} ); }
            });
        });
    });

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    })

    app.post('/quotes', (req, res) => {
        console.log('Hellooooooooooooooooo!');
    })
});