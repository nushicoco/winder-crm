/**
 * Created by einavcarmon on 21/06/2017.
 */
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap'
import Strings from '../../strings'
import { BackToFrequentBtn } from '../common';


export default class ChatNicknameModal extends Component {
    constructor (props) {
        super(props);

        this.state = {
            show: props.show,
            nickname : '',
            user:props.user
        }

        this.updateNick = props.updateNick;
        this.onExited = props.onExited;
    }

    close() {
        this.setState({ show: false });
    }

    onChange(e) {
        this.updateNick(e.target.value);
    }

    render() {
        return (
        <Modal show={this.state.show} onExited={() => this.onExited()}>
                <Modal.Header>
                    <Modal.Title>{Strings.chat.nicknameHeader}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <input className="nickname" onChange={this.onChange.bind(this)}/>
                    <Button bsStyle="primary"
                            onClick={ () => {this.close()} } >{Strings.chat.startChat}
                    </Button>
                </Modal.Body>

                <Modal.Footer>
                    <BackToFrequentBtn/>
                </Modal.Footer>
        </Modal>
        )
    }
}
