// assert = require('assert')
require('should')
const { User } = require('../models')

beforeEach(function () {
    User.drop()
    return User.sync()
})

describe('User', () =>  {
    describe('#create', function () {
        it('should allow creating a new valid user', function () {
            return User.create({
                firstName: 'great name',
                lastName: 'last name',
                password: 'awesome password',
                email: 'bob@habanai.com'
            }).should.be.fulfilled()
        })

        it('should not allow bad email', function () {
            return User.create({
                firstName: 'great name',
                lastName: 'lastname',
                password: 'greatpassword',
                email: 'bad. very bad.'
            }).should.be.rejectedWith(/validation.+email/i)
        })

        it('should not allow duplicate emails', function () {
            return User.create({
                firstName: 'hello',
                lastName: 'world',
                email: 'asd@asd.com',
                password: 'asd'
            }).then(function (user1) {
                return User.create({
                    firstName: 'goodbye',
                    lastNAme: 'earth',
                    email: 'asd@asd.com',
                    password: 'asd'
                })
            }).should.be.rejectedWith(/validation/i)
        })

        it('should not allow empty name', function () {
            return User.create({
                firstName: '',
                lastName: 'lastname',
                password: 'greatpassword',
                email: 'uniqueEmail@bla.com'
            }).should.be.rejectedWith(/validation/i)
        })

        it('should not allow null name', function () {
            return User.create({
                firstName: null,
                lastName: 'lastname',
                password: 'greatpassword',
                email: 'uniqueEmail@bla.com'
            }).should.be.rejectedWith(/validation/i)
        })

        it('should check passwords correctly', function () {
            return User.create({
                firstName: 'Donal J',
                lastName: 'Trump',
                password: 'covfefe'
            }).then( function (user) {
                user.checkPassword('covfefe').should.be.true()
                user.checkPassword('conference').should.be.false()
            })
        })

    })
})
