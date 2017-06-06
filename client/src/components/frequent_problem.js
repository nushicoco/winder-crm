/**
 * Created by einavcarmon on 06/06/2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button,  ButtonToolbar, Glyphicon} from 'react-bootstrap';
import { Link } from 'react-router-dom'

import Footer from './footer'

export default class FrequentProblem extends Component {
    constructor(props) {
        super(props);

        // todo: if problem doesn't exist we should get it from the api

        this.state  = {
            problem:props.location.problem,
            choseDidntHelp:false,
            choseHelp:false,
            choseSomething:false,
        }

        this.choseDidntHelp = this.choseDidntHelp.bind(this);
        this.choseHelp = this.choseHelp.bind(this);
    }

    choseDidntHelp() {
        this.setState({ choseDidntHelp:true , choseSomething:true});

        this.context.mixpanel.track('solution didn\'t help for problem' ,{problemId:this.state.problem.id});
    }

    choseHelp() {
        this.setState({ choseHelp:true , choseSomething:true});
        this.context.mixpanel.track('solution did help for problem' ,{problemId:this.state.problem.id});
    }

    render() {
        return (
            <div>
                { !this.state.problem ?
                    <p>No Problem</p> :
                    <div>
                        <h2>{this.state.problem.subject}</h2>
                        <p>{this.state.problem.solution}</p>
                        <Button className={this.state.choseSomething ? 'hide' : ''}  bsStyle="success" onClick={ this.choseHelp }>פתר את הבעיה!</Button>
                        <Button className={this.state.choseSomething ? 'hide' : ''} onClick={ this.choseDidntHelp }>לא עזר לי..</Button>
                        {this.state.choseDidntHelp ? <p>נא לחייג לטכנאי - 052-6613344</p> : ''}
                        {this.state.choseHelp ? <p>מגניב! תודה על העדכון</p> : ''}
                    </div>
                }
            </div>
        );
    }
}

FrequentProblem.contextTypes = {
    mixpanel: PropTypes.object.isRequired
};