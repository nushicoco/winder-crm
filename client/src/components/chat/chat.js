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
        }

        // todo move url to .env
        // let socket = io(`${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`);
        this.socket = io(`http://localhost:8080`);

    }

    componentWillMount(){
        var self = this;
        createChat()
            .then( (resp) =>  {
                self.setState({
                    chats: self.state.chats.concat(resp)
                })

                // if (this.state.chats.length > 0){
                //     console.log(`setting active to ${self.state.chats[0].id}`);
                //     self.setState({activeChat : self.state.chats[0].id})
                // }

        })
            .catch(function (err){

        })

    }

    getTabClass (index) {
        if (index == this.state.activeChatIndex){
            return "active-tab";
        }

        return "hide";
    }

    handleChatChange (index) {
        this.setState({activeChatIndex : index });
    }

    render() {
        return (
            <div className="all-over">
                <div className="tabs">

                    <nav role='navigation' className="transformer-tabs">
                        <ul>
                            {this.state.chats.map((chat, index) => {
                                return (
                                    <li key={chat.id} onClick={ () => {this.handleChatChange(index)}}>
                                        <a href="javascript:void(0)" > { chat.id } </a></li>
                                )
                            })}
                        </ul>
                    </nav>
                    {/* todo this part sucks, we have x tabs that get renders everytime we change the chat*/}
                    {this.state.chats.map((chat, index) => {
                        return (
                            <div key={chat.id} id={`chat-div-${chat.id}`} className={this.getTabClass(index)} >
                                <ChatTab  key={`chat-tab-${chat.id}`} chatId={chat.id} client={ this.state.client } socket = { this.socket }></ChatTab>
                            </div>
                        )
                    })}
                    {/*<ChatTab  chatId={this.state.chats[this.state.activeChatId].id} client={ this.state.client } socket = { this.socket } />*/}
                </div>
            </div>
        )
    }
}
