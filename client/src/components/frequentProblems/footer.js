import React, { Component } from 'react';
import { ButtonToolbar} from 'react-bootstrap';
import { NewTicketButton, NewChatButton } from '../common';
import Strings from '../../strings.js'

import './frequentProblems.css'

export default class Footer extends Component {
    constructor(props){
        super(props);
        this.state = { shouldHide: props.shouldHide };
    }

    render() {
        return (
            <div className="footer">
                <ButtonToolbar>
                        <NewChatButton/>
                        <NewTicketButton />
                </ButtonToolbar>
                <p className="call-us"> { Strings.frequentProblems.callTech }</p>
            </div>
        );
    }
};
