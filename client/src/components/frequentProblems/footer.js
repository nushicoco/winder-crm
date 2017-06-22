import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button,  ButtonToolbar, Glyphicon} from 'react-bootstrap';
import { NewTicketButton } from '../common';
import Strings from '../../strings.js'

import './frequentProblems.css'

export default class Footer extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <ButtonToolbar>
                    {/*<Button className={ this.state.shouldHide ? 'hide' : ''} > <Glyphicon glyph="log-in" />  צ׳אט עם טכנאי</Button>*/}
                    <p className="call-us"> { Strings.frequentProblems.callTech }</p>
                    <NewTicketButton />
                </ButtonToolbar>
            </div>
        );
    }
};
