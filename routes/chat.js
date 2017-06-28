/**
 * Created by einavcarmon on 20/06/2017.
 */
const { onlySuperuser } = require('./helpers')

module.exports = function (app, passport) {
  const { Chat, ChatMessage } = require('../models')

  app.get('/admin/chat', onlySuperuser, (req, res) => {
    Chat.findAll({where: {active: true}})
                .then(all => res.status(200).send(all.map(item => item.toJSON())))
  })

  app.post('/chat', (req, res) => {
    let clientName = req.param('clientName')
    let clientId = req.param('clientId')

    Chat.create({
      active: true,
      clientName: clientName,
      clientId: clientId
    })
            .then((chat) => {
              res.status(200).send(chat)
              return null
            })

            .catch((error) => {
              console.error(error)
              throw error
            })
  })

  app.get('/chats/:chatId', function (req, res) {
    const chatId = req.params.chatId
    Chat.findOne({
      where: {
        id: chatId
      },
      include: [{all: true, nested: true}],
      order: [[ChatMessage, 'createdAt', 'ASC']]
    })
        .then((chat) => {
          if (!chat) {
            res.sendStatus(400).send({errorMessage: "couldn't find chat"})
          }
          res.status(200).send(chat.toJSON())
          return null
        })
        .catch((error) => {
          console.error(error)
          res.sendStatus(400)
        })
  })
}
