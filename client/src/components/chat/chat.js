/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';
import { createChat } from '../../api';
import { Tabs, Tab } from 'react-bootstrap';
import io from 'socket.io-client'

import { Modal, Button } from 'react-bootstrap'
import Strings from '../../strings'
import { BackToFrequentBtn } from '../common';

import ChatTab from "./chatTab";
// import ChatNicknameModal from './chatModal'
import './chat.css'

export default class chatTab extends Component {

    constructor (props) {
        super(props);

        this.state = {
            chats : [],
            client: props.user ? props.user.firstName : '',
            activeChatIndex: 0,
            showModal:true,
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
        if (this.state.user)
        {
            this.setState({client:this.state.user.firstName});
        }
    }

    closeModal() {
        this.setState({ showModal: false });
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

    render() {
        return (
            <div className="all-over">
                <Modal show={!this.state.user && this.state.showModal} onExited = {() => this.createChat()}>
                    <Modal.Header>
                        <Modal.Title>{Strings.chat.nicknameHeader}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <input className="nickname" onChange={(e) => this.setState({client:e.target.value})}/>
                        <Button bsStyle="primary"
                                onClick={ () => {
                                    {/*this.createChat();*/}
                                    this.closeModal();
                                } } >{Strings.chat.startChat}
                        </Button>
                    </Modal.Body>

                    <Modal.Footer>
                        <BackToFrequentBtn/>
                    </Modal.Footer>
                </Modal>

                {/*<h2>client: I'm {this.state.client}</h2>*/}
                {/*{this.state.user && <h2>User: I'm {this.state.user.firstName}</h2>}*/}

                { this.state.chats.length == 0 && this.state.user && this.state.user.isSuperuser &&
                    <p>No chats pending</p>
                }
                { this.state.chats.length == 1 &&
                    <ChatTab chatId={this.state.chats[0].id} client={ this.state.client || this.state.user.firstName} socket={ this.socket }></ChatTab>
                }
                { this.state.chats.length > 1 &&
                <div className="tabs">
                    <Tabs activeKey={this.state.activeChatIndex} onSelect={this.handleChatChange.bind(this)}
                          id="chatTabs">
                        {this.state.chats.map((chat, index) => {
                            return (
                                <Tab key={chat.id} eventKey={index} title={chat.client}>
                                    <ChatTab key={`chat-tab-${chat.id}`} chatId={chat.id} client={ this.state.client || this.state.user.firstName}
                                             socket={ this.socket } isSuperuser={this.state.user && this.state.user.isSuperuser}/>
                                </Tab>
                            )
                        })}
                    </Tabs>
                </div>
                }

                <div>
                    <BackToFrequentBtn/>

                    {/*{(!this.state.user || !this.state.user.isSuperuser) &&*/}
                    {/*<NewTicketButton />*/}
                    {/*}*/}

                </div>
            </div>
        )
    }
}
