import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getFrequentProblemsList } from '../../api.js'
import Footer from './footer'
import Strings from '../../strings'
import LoadingBox from '../loadingBox'

import './frequentProblems.css'

export default class FrequentProblemsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      problems: []
    }
    this.getFrequentProblems()
  }

  getFrequentProblems () {
    getFrequentProblemsList()
            .then((problems) => {
              this.setState({
                isLoading: false,
                problems
              })
            })
            .catch((error) => {
              this.setState({
                isLoading: 'error'
              })
              console.error(error)
            })
  };

  render () {
    return (
      <div className='container'>
        <h1> { Strings.frequentProblems.header } </h1>
        <div className='sub-container'>
          <LoadingBox show={this.state.isLoading} >
            <Table bordered condensed hover>
              <tbody>
                {this.state.problems.map(problem => (
                  <tr key={problem.id} >
                    <td>
                      <div>
                        <Link to={{ pathname: `/frequent/${problem.id}`, problem }} className='frequent-link'>
                          {problem.subject}
                        </Link>
                      </div>
                    </td>
                  </tr>
                                    ))}
              </tbody>
            </Table>
          </LoadingBox>
        </div>
        <Footer user={this.props.user} />
      </div>
    )
  }
}
