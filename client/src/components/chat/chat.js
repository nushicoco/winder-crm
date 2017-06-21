/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';
import { createChat } from '../../api';
import { Tabs, Tab } from 'react-bootstrap';
import io from 'socket.io-client'

import './chat.css'
import ChatTab from "./chatTab";
import ChatNicknameModal from './chatModel'

export default class chatTab extends Component {

    constructor (props) {
        super(props);

        // todo not sure why props.user is null
        this.state = {
            chats : [],
            client: '',
            activeChatIndex: 0,
            user: props.user
        };

        // todo move url to .env
        // let socket = io(`${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`);
        this.socket = io.connect(`http://localhost:8080`);
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
                />
                { this.state.chats.length == 0 && this.state.user && this.state.user.isSuperuser &&
                    <p>No chats pending</p>
                }
                { this.state.chats.length == 1 && this.state.client &&
                    <ChatTab chatId={this.state.chats[0].id} client={ this.state.client } socket={ this.socket }></ChatTab>
                }
                { this.state.chats.length > 1 &&
                    <div className="tabs">
                        <Tabs activeKey={this.state.activeChatIndex} onSelect={this.handleChatChange.bind(this)} id="chatTabs">
                            {this.state.chats.map((chat, index) => {
                                return (
                                    <Tab key={chat.id} eventKey={index} title={chat.client}>
                                        <ChatTab  key={`chat-tab-${chat.id}`} chatId={chat.id} client={ this.state.client } socket = { this.socket }></ChatTab>
                                    </Tab>
                                )
                            })}
                        </Tabs>
                    </div>
                }
            </div>
        )
    }
}
