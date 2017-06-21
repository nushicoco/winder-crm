/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';
import { createChat } from '../../api';
import { Tabs, Tab } from 'react-bootstrap';
import io from 'socket.io-client'

import './chat.css'
import ChatTab from "./chatTab";

export default class chatTab extends Component {

    constructor (props) {
        super(props);

        this.state = {
            chats : [],
            client: props.match.params.client,
            activeChatIndex: 0,
        };

        // todo move url to .env
        // let socket = io(`${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`);
        this.socket = io.connect(`http://localhost:8080`);
    }

    componentWillMount(){
        var self = this;
        createChat(this.state.client)
        .then( (resp) =>  {
            self.setState({
                chats: self.state.chats.concat(resp)
            })
        })
        .catch(function (err){
        })
    }

    handleChatChange (index) {
        this.setState({activeChatIndex : index });
    }

    render() {
        return (
            <div className="all-over">
                {!this.state.chats.length && <p>No chats pending</p>}
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
            </div>
        )
    }
}
