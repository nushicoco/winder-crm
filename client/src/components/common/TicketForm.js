import React from 'react'
import { Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import Strings from '../../strings'
import Settings from '../../settings'

export default function TicketForm ({fieldValues, lockName, onFieldChange}) {
  const fields = [
    [ 'name', TicketTextField, {locked: lockName} ],
    [ 'phone', TicketTextField ],
    [ 'subject', TicketSelectField, {options: Settings.subjects} ],
    [ 'room', TicketSelectField, {options: Settings.rooms} ],
    [ 'content', TicketTextareaField ]
  ]

  const fieldComponents = fields.map(([field, component, props]) => {
    return React.createElement(component, {
      key: field,
      field: field,
      value: fieldValues[field],
      onChange: (e) => onFieldChange(field, e.target.value),
      ...props
    })
  })
  return (<div> { fieldComponents } </div>)
}

class TicketField extends React.Component {
  render () {
    const { field,
            type,
            children,
            componentClass,
            locked,
            style,
            validationState
          } = this.props

    return (
      <Row>
        <FormGroup
          controlId={field}
          validationState={validationState} >
          <Col componentClass={ControlLabel} sm={4} className='subject-label' >
            {Strings.ticket[field] }
          </Col>
          <Col sm={8}>
            <FormControl
              type={type}
              disabled={locked}
              value={this.props.value}
              componentClass={componentClass}
              style={style}
              onChange={e => this.props.onChange(e)}>
              { children }
            </FormControl>
          </Col>
        </FormGroup>
      </Row>
    )
  }
}

const TicketTextField = function ({ field, locked, onChange, value }) {
  return (
    <TicketField
      type='text'
      onChange={e => onChange(e)}
      field={field}
      value={value}
      locked={locked} />
  )
}

const TicketSelectField = function ({field, options, onChange, value}) {
  const defaultOption = (<option key={field + 'default'} value={''}>{Strings.ticket.select}</option>)
  const optionComponents = [defaultOption].concat(options.map(option => (
    <option key={field + option} value={option}>
      { option }
    </option>
  )))

  return (
    <TicketField
      type='select'
      componentClass='select'
      field={field}
      value={value}
      onChange={onChange}>
      { optionComponents }
    </TicketField>
  )
}

const TicketTextareaField = function ({field, onChange, value}) {
  return (
    <TicketField value={value} field={field} style={{height: 100}} componentClass='textarea' onChange={onChange} />
  )
}
