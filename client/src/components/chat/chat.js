/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react'
import { createChat } from '../../api'

import LoadingBox from '../loadingBox'
import { BackToFrequentBtn } from '../common'

import ChatTab from './chatTab'
import EnterNicknameWindow from './EnterNickname'
import './chat.css'
import createSocket from './createSocket'

export default class chatTab extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      chatId: null,
      nickname: null
    }
    this.socket = createSocket()
  }

  getClientName () {
    return this.props.user ? this.props.user.firstName : this.state.nickname
  }

  componentWillMount () {
    // In case the component was initialized with a user:
    this.props.user && this.createChat()
  }

  componentDidUpdate (prevProps) {
    // In case the component received a user after initialization:
    if (!prevProps.user && this.props.user) {
      this.createChat()
    }
  }

  createChat () {
    createChat(this.getClientName())

      .then((chat) => {
        this.setState({
          isLoading: false,
          chatId: chat.id
        })
      })

      .catch((err) => {
        this.setState({
          isLoading: 'error'
        })
        console.error(err)
      })
  }

  handleNicknameSet (nickname) {
    this.setState({nickname})
    this.createChat()
  }

  renderChat () {
    if (!this.state.chatId) {
      return null
    }

    return (
      <ChatTab
        chatId={this.state.chatId}
        clientName={this.getClientName()}
        socket={this.socket} />
    )
  }

  render () {
    const hasNoUser = this.props.userQueryCompleted && !this.props.user
    const hasNoNickname = !this.state.nickname
    return (
      <div className='all-over'>
        <EnterNicknameWindow
          onNicknameSet={this.handleNicknameSet.bind(this)}
          show={hasNoUser && hasNoNickname} />

        <LoadingBox show={this.state.isLoading}>
          { this.renderChat() }
        </LoadingBox>

        <BackToFrequentBtn />
      </div>
    )
  }
}
