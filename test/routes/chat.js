/**
 * Created by einavcarmon on 24/06/2017.
 */
const chai = require('chai')
const expect = chai.expect
chai.should()
chai.use(require('chai-http'))

const app = require('../../server')
const { Chat, ChatMessage} = require('../../models')

describe('POST /chat', function () {
    it('should create a new Chat', function (done) {
        Chat.create().then(function (chat) {

            chat.id.should.not.equal(undefined);
            done()
        })
    });

});
