// assert = require('assert')
require('should')
const { User } = require('../models')

beforeEach(function () {
    User.drop()
    return User.sync()
})

describe('User', () =>  {
    describe('#create', function () {
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
    })
})
