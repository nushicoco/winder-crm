/**
 * Created by einavcarmon on 14/06/2017.
 */
import React  from 'react';
import { Link } from 'react-router-dom'
import { Button , Glyphicon} from 'react-bootstrap'

import Strings from '../strings';

import './common.css';

export const BackToFrequentBtn = () => ( <Link to="/"><Button className="back-btn" >{ Strings.frequentProblems.back } </Button></Link>);

export class NewTicketButton extends React.Component {
    render () {
        return (
              <Link to="/new-ticket" >
                <Button  bsStyle="primary" className="open-ticket">
                  { Strings.ticket.openTicket }
                </Button>
              </Link>
        )
    }
}

export class NewChatButton extends React.Component {

    render () {
        return (
            <Link to="/chat" >
                <Button className="open-chat">
                    {/*<Glyphicon glyph="log-in" />*/}
                    {Strings.chat.newChat}
                </Button>
            </Link>
        )
    }
}
