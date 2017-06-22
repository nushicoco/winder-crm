import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, MenuItem} from 'react-bootstrap';

import Strings from '../strings';
import { logout } from '../api'

export default class LoginContainer extends React.Component {
    constructor(props, context) {
        super(props)
        this.context = context
        this.state = {
            user: props.user
        }
        this.allItems = this.adminItems.concat(this.userItems)
    }

    adminItems = [

        (
            <MenuItem header>{Strings.header.admin}</MenuItem>
        ),

        (
            <MenuItem eventKey="10" >
              <Link to="/admin/frequent-problems"
                    className="inline">
                {Strings.header.adminFrequentProblems}
              </Link>
            </MenuItem>
        ),

        (
            <MenuItem divider />
        )

    ]

    userItems = [
        (
            <MenuItem  eventKey="1" >
              <Link to="/new-ticket"  className="inline">
                {Strings.header.newTicket}
              </Link>
            </MenuItem>
        ),

        (
            <MenuItem  eventKey="2" >
              <Link to="/tickets"  className="inline">
                {Strings.header.viewTickets}
              </Link>
            </MenuItem>
        ),

        (
            <MenuItem divider />
        ),

        (
            <MenuItem  eventKey="2" onClick={() => logout()}>
              {Strings.header.logout}
            </MenuItem>
        ),
    ]

    componentWillReceiveProps(newProps) {
        this.setState({
            user: newProps.user
        })
    }

    render () {
        return this.state.user
            ? this.renderUser()
            : this.renderAnon()
    }

    renderAnon() {
        return (
            <div className="login-container">
              <a className="inline"
                 href="javascript:void(0)"
                 onClick={this.props.onLogin} >
                { Strings.header.loginAction }
              </a>
            </div>
        )
    }

    renderUser() {

        let items = this.state.user.isSuperuser
            ? this.allItems
            : this.userItems

        return (

            <div className="login-container">
              <p className="inline logged-in-header"> {Strings.header.welcome}, {this.state.user.firstName} !</p>
              <Dropdown
                className="user-actions-menu logged-in-header"
                bsSize="normal"
                id="user-action-menu">
                <Dropdown.Toggle>
                  { Strings.header.userActions }
                </Dropdown.Toggle>
                <Dropdown.Menu>

                  { items }

                </Dropdown.Menu>
              </Dropdown>
            </div>
        )
    }
}
