/**
 * Created by einavcarmon on 06/06/2017.
 */
import React, { Component } from 'react';
import { Button,  ButtonToolbar, Glyphicon} from 'react-bootstrap';
import { Link } from 'react-router-dom'

import Footer from './footer'

export default class FrequentProblem extends Component {
    constructor(props) {
        super(props);

        this.state  = {
            problem:props.location.problem
        }
    }

    render() {
        return (
            <div>
                { !this.state.problem ? <p>No Problem</p> :
                <div> <h2>{this.state.problem.subject}</h2>
                <p>{this.state.problem.solution}</p>
                <Button bsStyle="success">פתר את הבעיה!</Button>
                <Button>לא עזר לי..</Button>
                    <Footer/></div>}
            </div>
        );
    }
}