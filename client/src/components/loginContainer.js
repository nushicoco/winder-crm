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
            <MenuItem key="100" header>{Strings.header.admin}</MenuItem>
        ),

        (
            <MenuItem  key="10" eventKey="10" href="/admin/frequent-problems">
                {Strings.header.adminFrequentProblems}
            </MenuItem>
        ),

        (
            <MenuItem  key="11" eventKey="11" href="/admin/chats">
                {Strings.header.adminChats}
            </MenuItem>
        ),

        (
            <MenuItem key="101" divider />
        )

    ]

    userItems = [
        (
            <MenuItem key="1"  eventKey="1" href="/new-ticket" className="inline">
                {Strings.header.newTicket}
            </MenuItem>
        ),

        (
            <MenuItem key="2" eventKey="2" href="/tickets"  className="inline">
                {Strings.header.viewTickets}
            </MenuItem>
        ),

        (
            <MenuItem key="102" divider />
        ),

        (
            <MenuItem key="3"  eventKey="3" onClick={() => logout()}>
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
                   onClick={this.props.doLogin} >
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
