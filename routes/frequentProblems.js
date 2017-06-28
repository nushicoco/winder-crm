const { onlySuperuser } = require('./helpers')
module.exports = function (app, passport) {
  const { FrequentProblem } = require('../models')

  app.get('/frequent_problems', (req, res) => {
    FrequentProblem.findAll()
            .then(all => res.send(all.map(item => item.toJSON())))
  })

  app.get('/frequent_problem/:id', (req, res) => {
    let problemId = req.params.id
    FrequentProblem.findById(problemId)
            .then((problem) => res.send(problem.toJSON()))
            .catch(() => res.send(400))
  })

  app.post('/frequent_problem/new', onlySuperuser, (req, res) => {
    const { env, subEnv, subject, solution, solutionURL } = req.body
    FrequentProblem.create({ env, subEnv, subject, solution, solutionURL })
            .then(() => {
              res.status(200).send()
            })
  })

  app.post('/frequent_problem/:id', onlySuperuser, (req, res) => {
    const problemId = req.params.id
    const { env, subEnv, subject, solution, solutionURL } = req.body
    FrequentProblem.findById(problemId)
            .then((problem) => {
              problem.update({ env, subEnv, subject, solution, solutionURL })
            })
            .then(() => {
              res.status(200).send()
            })
  })

  app.delete('/frequent_problem/:id', onlySuperuser, (req, res) => {
    const problemId = req.params.id
    FrequentProblem.findById(problemId)
            .then((problem) => {
              problem.destroy()
            })
            .then(() => {
              res.status(200).send()
            })
  })
}
