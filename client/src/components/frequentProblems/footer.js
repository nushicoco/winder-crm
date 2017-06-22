import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button,  ButtonToolbar, Glyphicon} from 'react-bootstrap';
import { NewTicketButton } from '../common';
import Strings from '../../strings.js'
import { getTickets } from '../../api'

import './frequentProblems.css'

export default class Footer extends Component {
    constructor(props){
        super(props);

        this.state = { ticketsCount : 0 }
    }

    componentWillMount(){
        getTickets().then((tickets) => {
            this.setState({ticketsCount: tickets.length });
        })
    }

    render() {
        return (
            <div>
                <ButtonToolbar>
                    {/*<Button className={ this.state.shouldHide ? 'hide' : ''} > <Glyphicon glyph="log-in" />  צ׳אט עם טכנאי</Button>*/}
                    <p className="call-us"> { Strings.frequentProblems.callTech }</p>
                    <NewTicketButton />
                </ButtonToolbar>

                {this.state.ticketsCount > 0 &&
                    <ButtonToolbar>
                        <Link to="/tickets" >
                            <Button  bsStyle="info">
                                {Strings.TicketsList.viewTickets}
                            </Button>
                        </Link>
                    </ButtonToolbar>
                }
            </div>
        );
    }
};
