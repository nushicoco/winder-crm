/**
 * Created by einavcarmon on 19/06/2017.
 */

module.exports = function (app, io) {
    const { Chat, ChatMessage, User  } = require('./models')

    var connections = {};
    var msgCounter = 0 ;

    // delete open chats
    console.log("closing all chats");
    Chat.update({status:"closed"}, {where:{status:"active"}}).then(function (resp){
        console.log("closed all chats, resp = " + resp);
        return;
    });

    io.on('connection', function (socket) {

        //todo maybe change the connection[chatId] to socket rooms ?
        // for private msging -
        // socket.broadcast.to(id).emit('my message', msg);

        socket.on('client:connected', function(data){
            // connections[data.chatId] =  connections[data.chatId] ? connections[data.chatId].concat([socket]) : [socket];
            // let chat;
            // Chat.findOne({id:data.chatId}).then(function (chatById){
            //     chat = chatById
            // })
            // socket.chatId = data.chatId;
            // socket.clients = socket.clients ? socket.clients.concat([data.client]) : [data.client]

            // console.log("client " + data.client + " connected");

            socket.join(data.chatId);

            // todo notify slack with chatId ?

        })

        socket.on('client:sendMessage', function (data) {

            io.to(data.chatId).emit('server:gotMessage', data);

            Chat.findById(socket.chatId).then( (chat) => {
                return ChatMessage.create({
                    chatId: data.chatId,
                    text: data.text,
                    client: data.client
                })
            })
        });

        socket.on('super:getClients', function (){

        })

        socket.on('disconnect', function () {
            console.log("socket " +  socket.id + " disconnected");


        });
    });
}