/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';
import TextSubmitter from './textSubmitter'
import Message from './message'


export default class chatTab extends Component {

    constructor (props) {
        super(props);

        this.state = {
            chatId : props.chatId,
            messages: [],
            client: props.client,
            user: props.user
        }

        this.socket = props.socket;
    }

    componentWillMount() {
        console.log("here in chat tab will mount");
        let self = this;
        this.socket.emit(`client:connected`, { chatId : this.state.chatId , client: this.state.client })
        this.socket.on(`server:gotMessage`, data => {
            // this is only for super user that should have one socket for all chats
            if (data.chatId != this.state.chatId){
                return;
            }
            self.setState( { messages : self.state.messages.concat([data]) } );
        })

    }

    sendMessage = message => {
        this.socket.emit(`client:sendMessage`, { text: message, from:this.state.client, chatId:this.state.chatId})
    }

    render() {
        return (
        <div className="container">
            <h2>Chat #{ this.state.chatId }</h2>
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
