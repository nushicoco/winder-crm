const { User } = require('../models')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

const goodGuyGreg = {
    firstName: 'goodguygreg',
    lastName: 'deer',
    password: 'greatpassword',
    email: 'goodguygreg@deer.com'
}

describe('/signup POST', function () {

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
            }).then(function (res) {
                throw '(((duplicated email got accepted)))'
            })
            .catch( function (error) {
                error.should.have.property('response')
                error.response.status.should.be.equal(400)
                error.response.text.should.match(/email/i)
            })
    })

    it('should reject a bad email signup', function () {
        return chai.request(app)
            .post('/signup')
            .send(Object.assign({}, goodGuyGreg, {email: 'bademail.com'}))
            .then( function (res) {
                throw '((( bad email got accepted )))'
            }).catch( function (error) {
                error.should.have.property('response')
                error.response.status.should.be.equal(400)
                error.response.text.should.match(/email/i)
            })
    })


    it('should reject a no name signup', function () {
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
            })
    })

})

describe('session stuff' , function () {
    beforeEach(function () {
        return User.sync({ force: true })
    })

    it('/user should return 400 for nonlogins', function (done) {
        chai.request(app).get('/user').send()
            .end( function (error, response) {
                expect(response.status).equal(400)
                done()
            })
    })


    it('/signup should login and save session after signup', function (done) {
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
                        expect(res.body).to.deep.include({
                            firstName: goodGuyGreg.firstName,
                            lastName: goodGuyGreg.lastName,
                            email: goodGuyGreg.email
                        })
                        done()
                    })
            })
    })

    it('/login should save session after login', function (done) {
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
                                    firstName: goodGuyGreg.firstName,
                                    lastName: goodGuyGreg.lastName,
                                    email: goodGuyGreg.email
                                })
                                done()
                            })
                    })
            })
    })
})

describe('/login POST', function () {
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
})

describe.only('/logout', function () {
    it('should sign out', function (done) {
        const agent = chai.request.agent(app)
        agent.post('/signup').send(goodGuyGreg)
            .end(function (error, res) {
                res.status.should.be.equal(200)
                agent.get('/user').send()
                    .end(function (error, res) {
                        res.status.should.be.equal(200)
                        agent.post('/logout').send()
                            .end(function () {
                                res.status.should.be.equal(200)
                                agent.get('/user').send()
                                    .end(function (error, res) {
                                        res.status.should.be.equal(400)
                                        done()
                                    })
                            })
                    })

            })
    })
})
