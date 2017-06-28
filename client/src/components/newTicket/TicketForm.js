import React from 'react'
import { Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import Strings from '../../strings'

const AVAILABLE_SUBJECTS = Strings.ticket.subjects
const AVAILABLE_ROOMS = [
  '501', '502', '503', '504', '505', '506', '507',
  '508', '509', '510', '511', '512', '513', '514',
  '515', '516', '517', '518', '519', '520', '521',
  '522', '523', '524',
  '601', '602', '603', '604', '605', '606', '607',
  'Mix1', 'Mix2', 'אחר']
    // TOOD Move to client-specific configuration

export default function TicketForm ({fieldValues, lockName, onFieldChange}) {
  const fields = [
    [ 'name', TicketTextField, {locked: lockName} ],
    [ 'phone', TicketTextField ],
    [ 'subject', TicketSelectField, {options: AVAILABLE_SUBJECTS} ],
    [ 'room', TicketSelectField, {options: AVAILABLE_ROOMS} ],
    [ 'content', TicketTextareaField ]
  ]

  const fieldComponents = fields.map(([field, component, props]) => {
    return React.createElement(component, {
      key: field,
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

const TicketTextareaField = function ({field, onChange}) {
  return (
    <TicketField field={field} style={{height: 100}} componentClass='textarea' onChange={onChange} />
  )
}
