import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'

import LoadingBox from '../loadingBox'
import { getAdminChat } from '../../api'
import strings from '../../strings'
import createSocket from './createSocket'
import ChatTab from './chatTab'

export default class ChatsAdmin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      chats: []
    }
    this.socket = createSocket()
  }

  componentDidMount () {
    getAdminChat()

      .then((chats) => {
        this.setState({
          isLoading: false,
          chats
        })
      })

      .catch((error) => {
        this.setState({
          isLoading: 'error',
          chats: []
        })
        console.error(error)
      })
  }

  renderTabs () {
    if (this.state.chats.length === 0) {
      return strings.chat.noChats
    }

    return (
      <Tabs defaultActiveKey={1} id='chatTabs'>
        { this.state.chats.map((chat, index) => {
          return (
            <Tab key={chat.id} eventKey={index} title={`${index + 1}] ${chat.clientName}`}>
              <ChatTab
                chatId={chat.id}
                clientName={this.props.user.firstName}
                socket={this.socket}
                isSuperUser
                />
            </Tab>
          )
        })}
      </Tabs>
    )
  }

  render () {
    return (
      <LoadingBox show={this.state.isLoading}>
        <div className='container'>
          { this.renderTabs() }
        </div>
      </LoadingBox>
    )
  }
}
