/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react'
import { createChat, getAdminChat } from '../../api'
import { Modal, Button, Tabs, Tab } from 'react-bootstrap'
import io from 'socket.io-client'

import Strings from '../../strings'
import { BackToFrequentBtn } from '../common'

import ChatTab from './chatTab'
import './chat.css'

export default class chatTab extends Component {
  constructor (props) {
    super(props)

    this.state = {
      chats: [],
      activeChatIndex: 0,
      customerName: '',
      showModal: true,
      user: props.user
    }
    const CHAT_HOST = process.env.REACT_APP_CHAT_HOST
    const CHAT_PORT = process.env.REACT_APP_CHAT_PORT

    this.socket = io.connect(`${CHAT_HOST}:${CHAT_PORT}`)
  }

  componentWillReceiveProps (nextProps) {
        // b/c we read the user from the cookie it takes time for it to
        // be set
    this.setState({user: nextProps.user})
  }

  closeModal () {
    this.setState({ showModal: false })
  }

  getClientName () {
    return this.state.user ? this.state.user.firstName : this.state.customerName
  }

  createChat () {
    if (this.state.user && this.state.user.isSuperuser) {
      getAdminChat()
                .then((resp) => {
                  this.setState({
                    chats: this.state.chats.concat(resp)
                  })
                })
                .catch(function (err) {
                  console.log(`error in getAdminChat ${err}`)
                })
    } else {
      createChat(this.getClientName())
                .then((resp) => {
                  this.setState({
                    chats: this.state.chats.concat(resp)
                  })
                })
                .catch(function (err) {
                  console.log(`error in createChat ${err}`)
                })
    }
  }

  componentWillMount () {
    if (this.state.user) {
      this.createChat()
    }
  }

  handleChatChange (index) {
    this.setState({ activeChatIndex: index })
  }

  renderChatTab (chatId) {
    return <ChatTab key={`chat-tab-${chatId}`} chatId={chatId} clientName={this.getClientName()}
      socket={this.socket} isSuperuser={this.state.user && this.state.user.isSuperuser} />
  }

  render () {
    return (
      <div className='all-over'>
        <Modal show={!this.state.user && this.state.showModal} onExited={() => this.createChat()}>
          <Modal.Header>
            <Modal.Title>{Strings.chat.nicknameHeader}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <input className='nickname'
              onChange={(e) => this.setState({customerName: e.target.value})}
              maxLength='15' />
            <Button bsStyle='primary'
              onClick={() => {
                this.closeModal()
              }} >{Strings.chat.startChat}
            </Button>
          </Modal.Body>

          <Modal.Footer>
            <BackToFrequentBtn />
          </Modal.Footer>
        </Modal>

        { this.state.chats.length === 0 && this.state.user && this.state.user.isSuperuser &&
        <p>No chats pending</p>
                }

        { this.state.chats.length === 1 && this.renderChatTab(this.state.chats[0].id)}

        { this.state.chats.length > 1 &&
        <div className='tabs'>
          <Tabs activeKey={this.state.activeChatIndex} onSelect={this.handleChatChange.bind(this)}
            id='chatTabs'>
            {this.state.chats.map((chat, index) => {
              return (
                <Tab key={chat.id} eventKey={index} title={`${index + 1}:${chat.clientName}`}>
                  {this.renderChatTab(chat.id)}
                </Tab>
              )
            })}
          </Tabs>
        </div>
                }

        <div>
          <BackToFrequentBtn />
        </div>
      </div>
    )
  }
}
