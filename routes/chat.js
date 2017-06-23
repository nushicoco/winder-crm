/**
 * Created by einavcarmon on 20/06/2017.
 */

module.exports = function (app, passport) {

    const { Chat, ChatMessage, User  } = require('../models')

    var counter = 0;
    app.post('/chat', (req, res) => {
        // todo create chat in db and query them
        if (req.user && req.user.isSuperuser){
            console.log("super user logged in");
            Chat.findAll({where:{status:'active'}})
                .then( all => res.send(all.map( item => item.toJSON())))
        }else{

            var client = req.param("client");
            var clientId = req.param("clientId");
            Chat.create({status:'active', client: client, clientId:clientId})
                .then( (chat) => {
                    res.status(200).send(chat);
                    return null;
                })

                .catch( (error) => {
                    console.error(error)
                    throw error
                })
            // res.status(200).send({chatId:counter++});
        }
    });

    app.get('/chats/:chatId' ,function (req, res) {
        const chatId = req.params.chatId;
        console.log("getting chat with id=" + chatId);
        Chat.findOne({
            where: {
                id: chatId
            },
            include: [{all: true, nested: true}],
            order: [[ChatMessage, 'createdAt', 'ASC']]
        })
        .then( (chat) => {
            if (!chat){
                res.sendStatus(400).send({errorMessage: "couldn't find chat"})
            }
            res.status(200).send(chat.toJSON())
            return null;
        })
        .catch ( (error) => {
            console.error(error)
            res.sendStatus(400)
        })
    })
}