/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import Moment from 'moment';

import TextSubmitter from './textSubmitter';
import Message from './message';
import { getChat } from '../../api';

import Strings from '../../strings';


export default class chatTab extends Component {

    constructor (props) {
        super(props);

        this.state = {
            chatClientName: props.clientName,
            messages: [],
            myName: props.clientName,
            clientId: '',
            showIsTyping: ''
        }

        this.socket = props.socket;

        getChat(this.props.chatId).then((chat) => {
            this.setState({chatClientName: chat.clientName})
            this.setState({messages: chat.chat_messages})
        })

        this.ignoredOwnConnectMessage = false
    }

    componentWillMount() {
        let self = this;
        this.socket.emit(`client:connected`, {
            chatId : this.props.chatId ,
            clientName: this.state.myName,
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

            this.setState( {
                showIsTyping: '',
                messages : self.state.messages.concat([data])
            })
        })

        this.socket.on(`server:userConnected`, data => {

            if (!this.ignoredOwnConnectMessage){
                this.ignoredOwnConnectMessage = true
                return
            }

            let newUserMsg = {
                clientName: "system",
                text: `${data.clientName} ${Strings.chat.hasJoined}`,
                createdAd: Moment(),
                isMe: false
            }

            this.setState({messages: this.state.messages.concat([ newUserMsg ])})
        })

        this.socket.on('server:clientIsTyping', data => {
            if (data.clientId !== this.state.clientId){
                this.setState({showIsTyping:`${data.clientName} ${Strings.chat.isTyping}`});
                setTimeout( () => {
                    this.setState({showIsTyping:''})
                }, 5000)
            }
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

    notifyTyping () {
        this.socket.emit(`client:isTyping`)
    }

    render() {
        return (
        <div className="mini-container">
            <h2>
                {
                    this.props.isSuperuser
                    ? `${Strings.chat.chatWith} ${this.state.chatClientName}`
                    : Strings.chat.chatWithTech
                }
            </h2>

            <div className="chat-area" >
                {this.state.showIsTyping !== '' && (<div><p className="system-message">{this.state.showIsTyping}</p></div>)}
                <CSSTransitionGroup
                    transitionName="message"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}>
                {this.state.messages.map((msg, index) => {
                    return <Message key={index}
                                    author={msg.clientName}
                                    text={msg.text}
                                    time={msg.createdAt}
                                    isMe={ msg.clientId === this.state.clientId  || msg.clientName === this.state.myName}/>
                })}
                <div className="chat-bottom" ref={(el) => { this.messagesEnd = el; }} />
                </CSSTransitionGroup>
            </div>
            <TextSubmitter sendMessage={ this.sendMessage} notifyTyping={() => this.notifyTyping()}/>
        </div>
        )
    }
}
