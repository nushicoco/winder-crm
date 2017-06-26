import React from 'react'
import { Modal, Button } from 'react-bootstrap'

import Strings from '../../strings'
import { BackToFrequentBtn } from '../common'

export default class EnterNicknameWindow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nickname: ''
    }
  }

  render () {
    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>{Strings.chat.nicknameHeader}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input
            className='nickname'
            value={this.state.nickname}
            onChange={e => this.setState({nickname: e.target.value})}
            maxLength='15' />

          <Button bsStyle='primary'
            onClick={() => this.props.onNicknameSet(this.state.nickname)} >
            { Strings.chat.startChat }
          </Button>
        </Modal.Body>

        <Modal.Footer>
          <BackToFrequentBtn />
        </Modal.Footer>
      </Modal>
    )
  }
}
