const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const helpers = require('../support/helpers')
const { User } = require('../../models')
const app = require('../../server')


const goodGuyGreg = {
    firstName: 'goodguygreg',
    lastName: 'deer',
    password: 'greatpassword',
    email: 'goodguygreg@deer.com'
}

describe('/signup', function () {

    beforeEach(function () {
        User.drop()
        return User.sync()
    })

    it('should allow a good signup', function () {
        return chai.request(app)
            .post('/signup')
            .send(goodGuyGreg)
            .then(function (res) {
                res.status.should.be.equal(200)
                expect(res).to.be.json // <- this actually works O_o
                res.body.should.have.property('user')
                res.body.user.firstName.should.equal(goodGuyGreg.firstName)
                res.body.user.lastName.should.equal(goodGuyGreg.lastName)
                res.body.user.email.should.equal(goodGuyGreg.email)
            })
    })

    it('should reject a dulplicate email signup', function () {
        helpers.suppressConsoleError()
        return User.create(goodGuyGreg)
            .then( () => {
                return chai.request(app)
                    .post('/signup')
                    .send({
                        firstName: 'copycat',
                        lastName:  'goodguy',
                        email:      goodGuyGreg.email,
                        password:  'greatpassword'
                    })
            })
            .catch( function (error) {
                error.should.have.property('response')
                error.response.status.should.be.equal(400)
                error.response.text.should.match(/email/i)

                helpers.restoreConsoleError()
            })
    })

    it('should reject a bad email signup', function () {
        helpers.suppressConsoleError()

        return chai.request(app)
            .post('/signup')
            .send(Object.assign({}, goodGuyGreg, {email: 'bademail.com'}))
            .then( function (res) {
                throw '((( bad email got accepted )))'
            }).catch( function (error) {
                error.should.have.property('response')
                error.response.status.should.be.equal(400)
                error.response.text.should.match(/email/i)

                helpers.restoreConsoleError()
            })
    })


    it('should reject a no name signup', function () {
        helpers.suppressConsoleError()

        return chai.request(app)
            .post('/signup')
            .send({
                firstName: '',
                lastName: 'McMuffin',
                password: 'awesomegreatpassword',
                email: 'noreply@email.com'
            })
            .then(function (res) {
                throw '((( signup with no name got accepted )))'
            }).catch(function (error) {
                error.should.have.property('response')
                error.response.status.should.be.equal(400)
                error.response.text.should.match(/name/i)

                helpers.restoreConsoleError()
            })
    })

    it('should login and save session after signup', function (done) {
        const agent = chai.request.agent(app)
        //signup
        agent.post('/signup')
            .send(goodGuyGreg)
            .end(function (err, res) {
                res.status.should.be.equal(200)
                expect(res).to.be.json // <- this actually works O_o
                res.body.should.have.property('user')
                res.body.user.firstName.should.equal(goodGuyGreg.firstName)
                res.body.user.lastName.should.equal(goodGuyGreg.lastName)
                res.body.user.email.should.equal(goodGuyGreg.email)

                agent.get('/user').send()
                    .end(function (err, res) {
                        res.status.should.be.equal(200)
                        expect(res).to.be.json // <- this actually works O_o
                        expect(res.body).to.deep.equal({
                            user: {
                                firstName: goodGuyGreg.firstName,
                                lastName: goodGuyGreg.lastName,
                                email: goodGuyGreg.email,
                                isSuperuser: false
                            }
                        })
                        done()
                    })
            })
    })
})

describe('/user' , function () {
    beforeEach(function () {
        return User.sync({ force: true })
    })

    it('should return empty user for nonlogins', function () {
        return chai.request(app).get('/user').send()
            .then(function (res) {
                expect(res.status).to.equal(200)
                expect(res).to.be.json
                expect(res.body).to.not.include('user')
            })
    })


})


describe('/login', function () {
    beforeEach(function () {
        User.drop()
        return User.sync()
    })

    it('should allow a good login', function () {
        return User.create(goodGuyGreg).then(function () {
            const {email, password} = goodGuyGreg
            return chai.request(app)
                .post('/login')
                .send({email, password})
                .then(function (res) {
                    return res.status.should.be.equal(200)
                })
        })
    })

    it('should reject bad logins', function () {
        return chai.request(app)
            .post('/login')
            .send({
                email: 'hello@worldcom',
                password: 'this is great password'
            })
            .then(function (res) {
                throw new Error('((( bad login was accepted )))')
            })
            .catch(function (error) {
                error.should.have.property('response')
                error.response.status.should.equal(401)
            })
    })

    it('should save session after login', function (done) {
        // Create a new user:
        User.create(goodGuyGreg)
            .then(function () {

                // Login the new user:
                const agent = chai.request.agent(app)
                agent.post('/login').send({
                    email: goodGuyGreg.email,
                    password: goodGuyGreg.password
                })
                    .end(function (err, res) {
                        res.status.should.be.equal(200)
                        expect(res).to.have.cookie('winder-session')

                        // Check that the user is now logged-in:
                        agent.get('/user').send()
                            .end(function (err, res) {
                                res.status.should.be.equal(200)
                                expect(res).to.be.json
                                expect(res.body).to.deep.include({
                                    user: {
                                        firstName: goodGuyGreg.firstName,
                                        lastName: goodGuyGreg.lastName,
                                        email: goodGuyGreg.email,
                                        isSuperuser: false
                                    }
                                })
                                done()
                            })
                    })
            })
    })

})
describe('/logout', function () {

    it('should sign out', function (done) {
        User.sync({force: true}).then(function () {
            const agent = chai.request.agent(app)
            agent.post('/signup').send(goodGuyGreg)
                .end(function (error, res1) {
                    res1.status.should.be.equal(200)
                    agent.get('/user').send()
                        .end(function (error, res2) {
                            res2.status.should.be.equal(200)
                            agent.post('/logout').send()
                                .end(function (error, res3) {
                                    res3.status.should.be.equal(200)
                                    agent.get('/user').send()
                                        .end(function (error, res4) {
                                            res4.status.should.be.equal(200)
                                            expect(res4.body.user).to.be.undefined
                                            done()
                                        })
                                })
                        })

                })
        })
    })
})
