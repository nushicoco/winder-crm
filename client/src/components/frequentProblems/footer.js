import React, { Component } from 'react';
import { Button,  ButtonToolbar, Glyphicon} from 'react-bootstrap';
import { Link } from 'react-router-dom'

export default class Footer extends Component {
    constructor(props){
        super(props);
        this.state = { shouldHide: props.shouldHide };
    }
    render() {
        return (
            <div>
                {/*<ButtonToolbar>*/}
                    {/*<Button className={ this.state.shouldHide ? 'hide' : ''} bsStyle="info"><Link to="/ticket">פתח קריאה</Link></Button>*/}
                    {/*<Button className={ this.state.shouldHide ? 'hide' : ''} > <Glyphicon glyph="log-in" />  צ׳אט עם טכנאי</Button>*/}
                {/*</ButtonToolbar>*/}

                <p className="call-us"> במידת הצורך נא לחייג לטכנאי - 052-6613344</p>
            </div>
        );
    }
}