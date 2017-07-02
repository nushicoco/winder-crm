/**
 * Created by einavcarmon on 24/06/2017.
 */
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const chai = require('chai')
chai.should()
chai.use(require('chai-http'))

const { Chat } = require('../../models')

describe('POST /chat', function () {
  it('should create a new Chat', function (done) {
    Chat.create().then(function (chat) {
      chat.id.should.not.equal(undefined)
      done()
    })
  })
})
