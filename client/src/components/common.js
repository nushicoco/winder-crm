/**
 * Created by einavcarmon on 14/06/2017.
 */
import React  from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import Strings from '../strings';

export const BackToFrequentBtn = () => ( <Button className="back-btn" ><Link to="/">{ Strings.frequentProblems.back } </Link></Button>);

export const NewTicketButton = () => (
    <Button bsStyle="primary" className="open-ticket"> <Link to="/new-ticket" >{ Strings.ticket.openTicket }</Link></Button>
);