import React, { Component } from 'react';
import { Button,  ButtonToolbar, Glyphicon} from 'react-bootstrap';

export default class Footer extends Component {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Button bsStyle="info">פתח קריאה</Button>
                    <Button> <Glyphicon glyph="log-in" />  צ׳אט עם טכנאי</Button>
                </ButtonToolbar>
            </div>
        );
    }
}