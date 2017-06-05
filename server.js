/* eslint-disable no-console */
console.log('Starting Server......');

const express = require('express');
const app = express();
const pg = require('pg');
const port = process.env.PORT || 3001;
// process.env.NODE_ENV = 'production';

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) return console.error(err);

    app.listen(port, function (){

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        app.post('/quotes', (req, res) => {
            console.log('Hellooooooooooooooooo!');
        });

        app.post('/loco', (req, res) => {
            console.log('loco loco!');
            res.sendStatus(200);
        });
    });



    done();

    // client.query('SELECT * FROM test_table', function(err, result) {
    //     done();
    //
    // });

});
