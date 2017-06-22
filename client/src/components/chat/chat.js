/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';
import { createChat } from '../../api';
import { Tabs, Tab } from 'react-bootstrap';
import io from 'socket.io-client'

import { ButtonToolbar } from 'react-bootstrap'

import { BackToFrequentBtn, NewTicketButton } from '../common';

import ChatTab from "./chatTab";
import ChatNicknameModal from './chatModal'
import './chat.css'

export default class chatTab extends Component {

    constructor (props) {
        super(props);

        this.state = {
            chats : [],
            client: props.user ? props.user.firstName : '',
            activeChatIndex: 0,
            user: props.user
        };

        // todo move url to .env
        // let socket = io(`${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`);
        this.socket = io.connect(`http://localhost:8080`);
    }

    componentWillReceiveProps (nextProps){
        // b/c we read the user from the cookie it takes time for it to
        // be set
        this.setState({user:nextProps.user});
        if (this.state.user){
            this.setState({client: this.state.user.firstName});
        }
    }

    createChat(){
        var self = this;

        createChat(this.state.client)
        .then( (resp) =>  {
            self.setState({
                chats: self.state.chats.concat(resp)
            })
        })
        .catch(function (err){
            // todo what's here?
        })
    }

    componentWillMount(){
        if (this.state.user){
            this.setState({client:this.state.user.firstName});
            this.createChat();
        }
    }

    handleChatChange (index) {
        this.setState({activeChatIndex : index });
    }

    updateNick(client) {
        this.setState({client})
    }

    render() {
        return (
            <div className="all-over">
                <ChatNicknameModal show={!this.state.user || !this.state.user.firstName }
                                   updateNick = {this.updateNick.bind(this)}
                                   onExited = {this.createChat.bind(this)}
                                   user = {this.state.user}
                />
                { this.state.chats.length == 0 && this.state.user && this.state.user.isSuperuser &&
                    <p>No chats pending</p>
                }
                { this.state.chats.length == 1 && this.state.client &&
                    <ChatTab chatId={this.state.chats[0].id} client={ this.state.client } socket={ this.socket }></ChatTab>
                }
                { this.state.chats.length > 1 &&
                <div className="tabs">
                    <Tabs activeKey={this.state.activeChatIndex} onSelect={this.handleChatChange.bind(this)}
                          id="chatTabs">
                        {this.state.chats.map((chat, index) => {
                            return (
                                <Tab key={chat.id} eventKey={index} title={chat.client}>
                                    <ChatTab key={`chat-tab-${chat.id}`} chatId={chat.id} client={ this.state.client }
                                             socket={ this.socket }></ChatTab>
                                </Tab>
                            )
                        })}
                    </Tabs>
                </div>
                }

                <ButtonToolbar>
                    <BackToFrequentBtn/>

                    {(!this.state.user || !this.state.user.isSuperuser) &&
                    <NewTicketButton />
                    }

                </ButtonToolbar>
            </div>
        )
    }
}
