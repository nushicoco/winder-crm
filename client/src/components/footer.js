import React, { Component } from 'react';
import { Button,  ButtonToolbar, Glyphicon} from 'react-bootstrap';
import { Link } from 'react-router-dom'

export default class Footer extends Component {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Button bsStyle="info"><Link to="/ticket">פתח קריאה</Link></Button>
                    <Button> <Glyphicon glyph="log-in" />  צ׳אט עם טכנאי</Button>
                </ButtonToolbar>
            </div>
        );
    }
}