/**
 * Created by einavcarmon on 19/06/2017.
 */
// chat = require('/models/chat');

module.exports = function (app, io) {
    var connections = {};
    var msgCounter = 0 ;

    io.on('connection', function (socket) {

        //todo maybe change the connection[chatId] to socket rooms ?
        // for private msging -
        // socket.broadcast.to(id).emit('my message', msg);

        console.log(`socket id is ${socket.id}`);

        socket.on('client:sendMessage', function (data) {
            data.id = msgCounter++;
            data.chatId = socket.chatId;
            connections[socket.chatId].forEach(function (currSocket) {
                currSocket.emit('server:gotMessage', data);
            })
        });

        socket.on('client:connected', function(data){
            connections[data.chatId] =  connections[data.chatId] ? connections[data.chatId].concat([socket]) : [socket];
            socket.chatId = data.chatId;
            socket.clients = socket.clients ? socket.clients.concat([data.from]) : [data.from]

            // todo notify slack with chatId ?

        })

        socket.on('super:getClients', function (){

        })

        socket.on('disconnect', function (){
            // todo - deal with disconnect
            // connections[socket.chatId].
        });
    });
}