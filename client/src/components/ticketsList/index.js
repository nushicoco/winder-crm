import React from 'react'
import { Link } from 'react-router-dom'
import strings from '../../strings.js'
import { Button, ButtonGroup, Table} from 'react-bootstrap'
import { getTickets } from '../../api.js'
import { BackToFrequentBtn } from '../common'
import './ticketsList.css'
import LoadingBox from '../loadingBox'
import CSVExport from './csvexport'
import { TicketStatusIndicator } from '../common'
import TicketStatusSelector from '../common/TicketStatusSelector'

const NO_FILTER = 'all'
export default class TicketsList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      tickets: [],
      filter: 'all',
      user: props.user
    }

  }

  classForExtraColumns() {
    return (this.state.user && this.state.user.isSuperuser)
      ? ''
      : 'hide'
  }

  reload = () => {
    this.setState({
      tickets: [],
      isLoading: true
    })
    getTickets()
      .then( (tickets) => {
        this.setState({
          isLoading: false,
          tickets
        })
      })
      .catch( (error) => {
        if (error.status === 401) {
          this.props.doLogin()
          return
        }
        this.setState({
          isLoading: 'error'
        })
        console.error(error)
      })
  }

  filteredTickets = (() => {
    let allTickets, filteredTickets, lastFilter
    return () => {
      if (this.state.tickets === allTickets
          && this.state.filter === lastFilter )  {
        return filteredTickets
      }
      allTickets = this.state.tickets
      filteredTickets = allTickets.filter(this.filter)
      lastFilter = this.state.filter
      return filteredTickets
    }
  })()

  ticketsAsDataForCSV = () => {
    const headers = [[
      'id',
      'username',
      'name',
      'subject',
      'status',
      'createdAt',
      'updatedAt'
    ]]
    return headers.concat(this.filteredTickets().map(ticket => [
      ticket.id,
      this.formatUsername(ticket.user),
      ticket.details.name,
      ticket.details.subject,
      ticket.status,
      ticket.createdAt,
      ticket.updatedAt,
    ]))
  }

  componentWillReceiveProps (newProps) {
    if (this.props.user !== newProps.user) {
      this.setState({
        user: newProps.user
      })
      this.reload()
    }
  }

  componentDidMount () {
    this.reload()
  }

  renderToolbar() {
    return (
      <div className="tickets-list-filters">
        { strings.ticket.filters }
        <TicketStatusSelector
          extra={NO_FILTER}
          bsSize='xsmall'
          onChange={filter => this.setState({filter})}
          selected={this.state.filter}/>
          <div className="tickets-list-left-buttons">
            <Button
              className="inline"
              disabled={ !!this.state.isLoading }
              style={ {float: 'left'} }
              className="tickets-list-refresh-button"
              bsSize="xsmall"
              onClick={ () => this.reload() } >
              { strings.TicketsList.reload }
            </Button>

            <CSVExport
              className="inline"
              data={this.ticketsAsDataForCSV()}
              filename="tickets.csv">
              <Button
                bsSize="xsmall"
                disabled={ !!this.state.isLoading }
                >{ strings.ticket.csv } </Button>
            </CSVExport>

          </div>
      </div>)
  }

  filter = (ticket) => {
    return this.state.filter === NO_FILTER || ticket.status === this.state.filter
  }

  renderNoTicketsRow () {
    return (
      <tr>
        <td className="tickets-list-no-ticket" colSpan="7" >
          <LoadingBox show={ this.state.isLoading }>
            { strings.ticket.noTickets }
          </LoadingBox>
        </td>
      </tr>
    )

  }

  renderTickets () {
    const filteredTickets = this.filteredTickets()
    return (
      <div>
        { this.renderToolbar() }
        <Table className="tickets-list-table center centered" striped bordered condensed hover>
          <thead>
            <tr>
              <th>#</th>
              <th className={this.classForExtraColumns()}>{ strings.ticket.user } </th>
              <th className={this.classForExtraColumns()}>{ strings.ticket.name } </th>
              <th>{ strings.ticket.subject }</th>
              <th>{ strings.ticket.status }</th>
              <th>{ strings.ticket.dateIssued }</th>
              <th>{ strings.ticket.dateUpdated }</th>
            </tr>
          </thead>
          <tbody>
            { filteredTickets.length === 0
              ? this.renderNoTicketsRow()
              : filteredTickets.map(this.renderTicket)
            }
          </tbody>
        </Table>

      </div>
    )
  }

  renderNoTickets () {
    return (
      <div>
        { strings.ticket.noTickets }
      </div>
    )
  }

  render () {
    return (
      <div className="container">
        { this.state.user && (
          <h1>{ strings.TicketsList.headline[this.state.user.isSuperuser ? 'admin' : 'user'] }</h1>
        )}
      { this.renderTickets() }
        <BackToFrequentBtn/>
        </div>
    )
  }
  formatDate (date) {
    return new Date(date).toLocaleString()
  }

  formatUsername (user) {
    return user
      ? `${user.firstName || ''} ${user.lastName || ''}`
      : ''
  }

  renderTicket = (ticket) => {
    const user = ticket.user || {}
    return (
      <tr  key={ ticket.id } >
        <td>{ ticket.id }       </td>
        <td className={this.classForExtraColumns()}>{ this.formatUsername(user) } </td>
        <td className={this.classForExtraColumns()}>{ ticket.details.name }     </td>
        <td  >
          <Link to={ `/view-ticket/${ticket.id}?accessToken=${ticket.accessToken}` }>
            { ticket.details.subject }
          </Link>
        </td>
        <td > <TicketStatusIndicator status={ticket.status} /></td>
        <td className="ltr" > { this.formatDate(ticket.createdAt) }</td>
        <td className="ltr" > { this.formatDate(ticket.updatedAt) }</td>
      </tr>
    )
  }
}
