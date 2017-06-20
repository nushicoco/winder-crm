/**
 * Created by einavcarmon on 19/06/2017.
 */
import React, { Component } from 'react';
import {Row, Col, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'

import Strings from '../../strings';

export default class TextSubmitter extends Component {
    constructor (props) {
        super(props);

        this.state = {
            chatId: props.chatId
        }

        this.sendMessage =  props.sendMessage;

    }

    handleSubmit() {
        this.sendMessage(this.state.text);
        this.setState({text:''})
    }
    render() {
        return (
            //todo - don't use form, it's sucks! or somehow fix the submit
            <Form>
                <Row>
                    <FormGroup controlId="subject">
                        <Col sm={4}>
                            <FormControl
                                type="text"
                                value={ this.state.text }
                                onChange={ e => this.setState({text: e.target.value}) }
                                />
                        </Col>
                        <Col sm={2}>
                            <Button bsStyle="primary"
                                    className="submit-text"
                                    disabled={ this.state.isLoading || !this.state.text}
                                    onClick={ this.handleSubmit.bind(this) }>{ Strings.chat.submit }
                            </Button>
                        </Col>
                    </FormGroup>
                </Row>
            </Form>
        )
    }
}
