import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import Footer from './footer';
import Strings from '../../strings.js'


import './frequentProblems.css';

export default class FrequentProblemsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            problems: []
        }
        this.getFrequentProblems();
    }

    getFrequentProblems() {
        var self = this
        fetch("frequent_problems").then((response) =>{
            return response.json();
        }).then((problems) =>{
            self.setState({problems});
        });
    };

    setProblemDetails(problem){

    };

    render() {
        return (
            <div className="container">
                <h1> { Strings.frequentProblems.header } </h1>
                <div className="sub-container">
                    <Table bordered condensed hover>
                        <tbody>
                    {this.state.problems.map(function (problem) {
                        return <tr key={problem.id} onClick={this.setProblemDetails(problem)}>
                            <td>
                                <div>
                                {/*<Link to={`/frequent/${problem.id}`}>*/}
                                    <Link to={{ pathname: `/frequent/${problem.id}`, problem }} className="frequent-link">
                                        {problem.subject}
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    }.bind(this))}
                        </tbody>
                    </Table>
                </div>
                <Footer/>
            </div>
        )
    }
}