/* eslint-disable no-console */
console.log('Starting Server......');

const express = require('express');
const app = express();
var sqlite3 = require('sqlite3').verbose();
const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

var db = new sqlite3.Database(process.env.DATABASE_URL || './db/winder.db');

// db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
//     console.log(row.id + ": " + row.info);
// });

    app.listen(port, function (){

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        app.get('/frequent_problem/:id', (req, res) => {
            var problemId = req.params.id;
            db.all(`SELECT * FROM frequent_problems WHERE id = ${problemId}`, function(err, rows) {
                console.log(err);
                res.send(JSON.stringify(rows));
            });
        });

        app.get('/frequent_problems', (req, res) => {
            console.log('frequent_problems');
            db.all("SELECT * FROM frequent_problems", function(err, rows) {
                // console.log(err);
                res.send(JSON.stringify(rows));
            });
        });
    });


    // db.close();

    // done();
