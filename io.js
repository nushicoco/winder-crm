/**
 * Created by einavcarmon on 19/06/2017.
 */

module.exports = function (app, io) {
    const { Chat, ChatMessage, User  } = require('./models')

    var connections = {};
    var msgCounter = 0 ;

    io.on('connection', function (socket) {

        // close all old chats
        // Chat.update({status:'closed'},{where:{status:'open'}});

        //todo maybe change the connection[chatId] to socket rooms ?
        // for private msging -
        // socket.broadcast.to(id).emit('my message', msg);

        console.log(`socket id is ${socket.id}`);

        socket.on('client:sendMessage', function (data) {
            data.id = msgCounter++;
            data.chatId = socket.chatId;

            if (!connections[socket.chatId]){
                // todo check y dis happns
                console.log("in client:sendMessage -> connections[socket.chatId] is undefined for socket=" + socket.id + " and chat id =" + socket.chatId);
                return;
            }

            connections[socket.chatId].forEach(function (currSocket) {
                currSocket.emit('server:gotMessage', data);
            });

            Chat.findById(socket.chatId).then( (chat) => {
                return ChatMessage.create({
                    chatId: data.chatId,
                    text: data.text,
                    client: data.from
                })
            })
        });

        socket.on('client:connected', function(data){
            connections[data.chatId] =  connections[data.chatId] ? connections[data.chatId].concat([socket]) : [socket];
            // let chat;
            // Chat.findOne({id:data.chatId}).then(function (chatById){
            //     chat = chatById
            // })
            socket.chatId = data.chatId;
            socket.clients = socket.clients ? socket.clients.concat([data.from]) : [data.from]

            // todo notify slack with chatId ?

        })

        socket.on('super:getClients', function (){

        })

        socket.on('disconnect', function () {
            console.log("socket disconnected");
            if (!connections[socket.chatId]){
                // todo check y dis happns
                console.log("connections[socket.chatId] is undefined for socket=" + socket.id + " and chat id =" + socket.chatId);
                return;
            }
            var index = connections[socket.chatId].indexOf(socket);
            if (index > -1) {
                connections[socket.chatId].splice(index, 1);
            }

            if (connections[socket.chatId].length == 0){
                delete connections[socket.chatId];
            }
        });
    });

    io.on('connection', function () {

    });
}