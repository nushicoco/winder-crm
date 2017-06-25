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
            chatClientName: props.client,
            messages: [],
            myName: props.client,
            clientId: '',
        }

        this.socket = props.socket;

        let self = this;

        getChat(this.props.chatId).then(function (chat) {
            self.setState({chatClientName:chat.client})
            self.setState({messages:chat.chat_messages});
        })
    }

    componentWillMount() {
        let self = this;
        this.socket.emit(`client:connected`, {
            chatId : this.props.chatId ,
            client: this.state.myName,
            clientId:this.state.user && this.state.userId
        })

        this.socket.on (`server:connected`, data => {
            this.setState({clientId:data.clientId});
        })

        this.socket.on(`server:gotMessage`, data => {
            // this is only for super user that should have one socket for all chats
            if (data.chatId !== this.props.chatId){
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
        this.socket.emit(`client:sendMessage`, { text: message, chatId:this.props.chatId})
    }

    render() {
        return (
        <div className="mini-container">
            {this.props.isSuperuser ?
                <h2>
                    {Strings.chat.chatWith} {this.state.chatClientName}
                </h2>
                :
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
                                    isMe={ msg.clientId === this.state.clientId  || msg.client === this.state.myName}/>
                })}
                <div className="chat-bottom" ref={(el) => { this.messagesEnd = el; }} />
            </div>
            <TextSubmitter sendMessage={ this.sendMessage.bind(this) }/>
        </div>
        )
    }
}
