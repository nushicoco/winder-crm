/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';
import io from 'socket.io-client'
import TextSubmitter from './textSubmitter'
import Message from './message'


// todo - move socket higher up to the chat component
// todo move url to .env
// let socket = io(`${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`);
let socket = io(`http://localhost:8080`);

export default class chatTab extends Component {

    constructor (props) {
        super(props);

        this.state = {
            chatId : props.chatId,
            messages: [],
            client: props.client,
            user: props.user
        }
    }

    componentDidMount() {
        let self = this;
        socket.emit(`client:connected`, { chatId : this.state.chatId , client: this.state.client })
        socket.on(`server:gotMessage`, data => {
            // this is only for super user that should have one socket for all chats
            if (data.chatId != this.state.chatId){
                return;
            }
            self.setState( { messages : self.state.messages.concat([data]) } );
        })

    }

    sendMessage = message => {
        socket.emit(`client:sendMessage`, { text: message, from:this.state.client, chatId:this.state.chatId})
    }

    render() {
        return (
        <div className="container">
            <div className="chatArea" >
                {this.state.messages.map((msg) => {
                    return <Message key={msg.id} author={msg.from} text={msg.text} isMe={ msg.from == this.state.client }></Message>
                })}
            </div>
            <TextSubmitter sendMessage={ this.sendMessage }>
            </TextSubmitter>
        </div>
        )
    }
}
