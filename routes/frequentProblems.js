module.exports = function (app, passport) {
    const { FrequentProblem }= require('../models')

    app.get('/frequent_problems', (req, res) => {
        FrequentProblem.findAll()
            .then( all => res.send(all.map( item => item.toJSON())))
    });

    app.get('/frequent_problem/:id', (req, res) => {
        let problemId = req.params.id;
        FrequentProblem.findById(problemId)
            .then( (problem) => res.send(problem.toJSON()))
            .catch( (error) => res.send(400))
    });
}
