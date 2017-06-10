
const { FrequentProblem } = require('../models')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const should = chai.should()

chai.use(chaiHttp)

describe('GET /frequent_problems', function () {

    beforeEach(function () {
        FrequentProblem.drop()
        return FrequentProblem.sync()
    })

    it('should return a list', function () {
        return chai.request(app)
            .get('/frequent_problems')
            .then(function (res) {
                res.status.should.be.equal(200)
                res.body.should.match(/^\[/)
            })
            .catch((e) =>{console.error(''); throw(e)} )
    })
})
