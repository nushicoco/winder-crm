/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import TextSubmitter from './textSubmitter';
import Message from './message';
import { getChat } from '../../api';

import Strings from '../../strings';


export default class chatTab extends Component {

    constructor (props) {
        super(props);

        this.state = {
            chatId : props.chatId,
            messages: [],
            client: props.client,
            clientId: '',
            isSuperuser: props.isSuperuser
        }

        this.socket = props.socket;

        let self = this;

        getChat(this.state.chatId).then(function (chat) {
            self.setState({messages:chat.chat_messages});
        })
    }

    componentWillMount() {
        let self = this;
        this.socket.emit(`client:connected`, { chatId : this.state.chatId , client: this.state.client, clientId:this.state.user && this.state.userId });
        this.socket.on (`server:connected`, data => {
            this.setState({clientId:data.clientId});
        });

        this.socket.on(`server:gotMessage`, data => {
            // this is only for super user that should have one socket for all chats
            if (data.chatId != this.state.chatId){
                return;
            }
            self.setState( { messages : self.state.messages.concat([data]) } );
        })
    }

    scrollToBottom = () => {
        const node = ReactDOM.findDOMNode(this.messagesEnd);
        node.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    sendMessage = message => {
        this.socket.emit(`client:sendMessage`, { text: message, chatId:this.state.chatId})
    }

    render() {
        return (
        <div className="mini-container">
            {this.state.isSuperuser &&
                <h2>
                    {Strings.chat.chatWith} {this.state.client}
                </h2>
            }

            {!this.state.isSuperuser &&
                <h2>
                    {Strings.chat.chatWithTech}
                </h2>
            }
            <div className="chat-area" >
                {this.state.messages.map((msg, index) => {
                    return <Message key={index}
                                    author={msg.client}
                                    text={msg.text}
                                    time={msg.createdAt}
                                    isMe={ msg.clientId == this.state.clientId  || msg.client == this.state.client}></Message>
                })}
                <div style={{ float:"left", clear: "both" }}
                     ref={(el) => { this.messagesEnd = el; }} />
            </div>
            <TextSubmitter sendMessage={ this.sendMessage.bind(this) }>
            </TextSubmitter>
        </div>
        )
    }
}
