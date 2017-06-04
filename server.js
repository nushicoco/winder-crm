/* eslint-disable no-console */
console.log('Starting Server......');

const express = require('express');
const app = express();
const pg = require('pg');
const port = process.env.PORT || 3000;

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err)
    { console.error(err); }
    else
    {
        app.listen(port, function (){

            app.get('/', (req, res) => {
                res.sendFile(__dirname + '/index.html');
            });

            app.post('/quotes', (req, res) => {
                console.log('Hellooooooooooooooooo!');
            });
        });

    }

    // client.query('SELECT * FROM test_table', function(err, result) {
    //     done();
    //
    // });

});
