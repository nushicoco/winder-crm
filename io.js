/**
 * Created by einavcarmon on 19/06/2017.
 */

module.exports = function (app, io) {
    const { Chat, ChatMessage, User  } = require('./models')

    // delete open chats if server closed unexpectedly
    console.log("closing all open chats");
    Chat.update({active:false}, {where:{active:true}}).then(function (count){
        console.log("chats closed = " + count);
        return;
    });

    io.on('connection', function (socket) {
        socket.on('client:connected', function(data){
            socket.join(data.chatId);
            socket.chatId = data.chatId;
            socket.owner = data.clientName;
            socket.clientId = data.clientId || socket.id

            socket.emit('server:connected', {clientId: socket.clientId });
        });

        socket.on('client:sendMessage', function (data) {

            data.clientName = socket.owner;
            data.clientId = socket.clientId;
            io.to(data.chatId).emit('server:gotMessage', data);

            Chat.findById(socket.chatId).then( (chat) => {
                return ChatMessage.create({
                    chatId: data.chatId,
                    text: data.text,
                    clientName: data.clientName,
                    clientId: data.clientId
                })
            })
        });

        socket.on('disconnecting', function () {
            console.log("socket " +  socket.id + " is disconnecting");
            for (room in socket.rooms){
                if (room === socket.id){
                    continue;
                }

                // if no more clients in the room we close the chat
                let clients = io.sockets.adapter.rooms[room];
                if (clients && clients.length === 1){
                    Chat.update({active:false}, {where:{id:room}});
                }
            }
        });
    });
}