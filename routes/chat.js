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

            Chat.create({status:'active'})
                .then( (chat) => {
                    res.status(200).send(chat)
                })

                .catch( (error) => {
                    console.error(error)
                    throw error
                })
            // res.status(200).send({chatId:counter++});
        }
    });
}