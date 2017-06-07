/* eslint-disable no-console */
console.log('Starting Server......');

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

console.log("port ="  +port);
console.log("NODE_ENV =" + process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

const { User, FrequentProblem  } = require('./models')

// db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
//     console.log(row.id + ": " + row.info);
// });

    app.listen(port, function (){

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/client/build/index.html');
        });

        app.get('/frequent_problem/:id', (req, res) => {
            var problemId = req.params.id;
            FrequentProblem.findById(problemId)
                .then( (problem) => res.send(problem.toJSON()))
                .catch( (error) => res.send(400))
        });

        app.get('/frequent_problems', (req, res) => {
            FrequentProblem.findAll()
                .then( all => res.send(all.map( item => item.toJSON())))
        });
    });

    // done();
