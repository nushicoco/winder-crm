import React from 'react'
import {Form, FormGroup, FormControl, ControlLabel, Button, Modal} from 'react-bootstrap'
import Strings from '../../strings'
import './editFrequentProblem.css'

export default class EditFrequentProblem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            ...newProps.problem
        })
    }

    renderControl = (field) => {
        return (
            <FormGroup
              key={ field }
              className="align-right"
              controlId={ field } >
              <ControlLabel >
                { Strings.frequentProblems.admin.fields[field] }
              </ControlLabel>
              <FormControl
                type="text"
                onChange={ (e) => this.setState({[field]: e.target.value}) }
                value={this.state[field]}
                />
            </FormGroup>
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.onSubmit(this.state)
    }

    renderForm = () => {
        const controls = this.props.fields.map( this.renderControl )
        return (<form> { controls } </form>)
    }

    render () {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide } className="edit-frequent-problems" >
                <Modal.Header closeButton>
                  <Modal.Title>
                    {Strings.frequentProblems.admin.edit}
                  </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  { this.renderForm() }

                </Modal.Body>

                <Modal.Footer>
                  <Button
                    bsStyle="primary"
                    onClick={ this.handleSubmit }
                          >
                    { Strings.frequentProblems.admin.submit }
                  </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
