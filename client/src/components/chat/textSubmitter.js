/**
 * Created by einavcarmon on 19/06/2017.
 */
import React, { Component } from 'react'
import {Row, Col, Form, FormGroup, FormControl, Button} from 'react-bootstrap'

import Strings from '../../strings'

export default class TextSubmitter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      chatId: props.chatId
    }

    this.sendMessage = props.sendMessage
  }

  handleSubmit (e) {
    this.sendMessage(this.state.text)
    this.setState({text: ''})

        // disable enter from submitting, it's totally annoying
    e.preventDefault()
  }

  render () {
    return (
      <Form className='submitter' onSubmit={this.handleSubmit.bind(this)}>
        <Row>
          <FormGroup controlId='subject'>
            <Col>
              <FormControl
                type='text'
                value={this.state.text}
                onChange={e => {
                  this.setState({text: e.target.value})
                  this.props.notifyTyping()
                }}
                className='submitter-text'
                maxLength='200'
                                />
              <Button bsStyle='primary'
                disabled={this.state.isLoading || !this.state.text}
                type='button'
                onClick={this.handleSubmit.bind(this)}
                className='submitter-button'

                            >
                { Strings.chat.submit }
              </Button>
            </Col>
          </FormGroup>
        </Row>
      </Form>
    )
  }
}
