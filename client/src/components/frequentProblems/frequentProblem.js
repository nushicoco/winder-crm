/**
 * Created by einavcarmon on 06/06/2017.
 */
import React, { Component } from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { NewTicketButton, BackToFrequentBtn } from '../common'

import { recordEvent } from '../../analytics'
import Strings from '../../strings'
import { getFrequentProblem } from '../../api.js'

export default class FrequentProblem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      problem: props.location.problem,
      choseDidntHelp: false,
      choseHelp: false,
      choseSomething: false
    }

    if (!this.state.problem) {
      let problemId = props.match.params.id

      getFrequentProblem(problemId)
                .then((problem) => {
                  this.setState({problem})
                })
    }

    this.choseDidntHelp = this.choseDidntHelp.bind(this)
    this.choseHelp = this.choseHelp.bind(this)
  }

  recordProblemEvent (event) {
    const { id, subject, env, subEnv } = this.state.problem
    recordEvent(event, { id, subject, env, subEnv })
  }

  choseDidntHelp () {
    this.recordProblemEvent('did not help')
    this.setState({ choseDidntHelp: true, choseSomething: true })
  }

  choseHelp () {
    this.recordProblemEvent('did help')
    this.setState({ choseHelp: true, choseSomething: true })
  }

  render () {
    return (
      <div className='container'>
        { !this.state.problem
                    ? <p>No Problem</p>
                    : <div className='sub-container'>
                      <h1>{this.state.problem.subject}</h1>
                      {this.state.problem.solution && <p className='solution'>{this.state.problem.solution}</p>}
                      {this.state.problem.solutionURL && <iframe className='pdf-viewer' src={this.state.problem.solutionURL} frameBorder='0' />}

                      <ButtonToolbar className='problem-buttons'>
                        <Button className={this.state.choseSomething ? 'hide' : 'problem-button'}
                          bsStyle='success'
                          onClick={this.choseHelp}
                                    > { Strings.frequentProblems.helped } </Button>
                        { !this.state.choseSomething && <NewTicketButton user={this.props.user} /> }
                        {this.state.choseHelp ? <p className='click-feedback'> { Strings.frequentProblems.thanksForFeedback }</p> : ''}
                      </ButtonToolbar>
                    </div>
                }
        <BackToFrequentBtn />
      </div>
    )
  }
}
