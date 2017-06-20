import React from 'react'
import { Form, FormGroup, FormControl, ControlLabel, Button, Modal, DropdownButton, MenuItem } from 'react-bootstrap'


import Strings from '../../strings'
import './editFrequentProblem.css'

export default class EditFrequentProblem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { }
    }

    componentWillReceiveProps(newProps) {
        let problem = {}
        this.props.fields.map( field => problem[field] = newProps.problem[field])
        this.setState({
            ...problem
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
                type="textarea"
                componentClass="textarea"
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
                  { this.props.showDelete && (
                  <DropdownButton title={ Strings.frequentProblems.admin.options } id="frequent-problems-edit-options">
                    <MenuItem eventKey="1" onClick={ this.props.onDelete } >
                      { Strings.frequentProblems.admin.delete }
                    </MenuItem>
                  </DropdownButton>
                  )}
                </Modal.Footer>
            </Modal>
        )
    }
}
