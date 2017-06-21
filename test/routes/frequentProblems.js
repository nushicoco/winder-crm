const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect

const { FrequentProblem } = require('../../models')
const app = require('../../server')

chai.use(chaiHttp)

describe('/frequent_problems', function () {

    beforeEach(function () {
        return FrequentProblem.sync({force: true})
    })

    it('should return a list', function () {
        return chai.request(app)
            .get('/frequent_problems')
            .then(function (res) {
                res.status.should.be.equal(200)
                expect(res).to.be.json
                res.body.should.be.an('array')
            })
            .catch((e) =>{console.error(''); throw(e)} )
    })
})
