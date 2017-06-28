import React from 'react'
import { recordEvent } from '../analytics'

export default class RouteAnalytics extends React.Component {
  componentWillMount () {
    if (this.props.userQueryCompleted) {
      this.recordRouteEvent(this.props)
    }
  }
  componentWillReceiveProps (newProps) {
    if (newProps.location.pathname !== this.props.location.pathname ||
        newProps.user !== this.props.user) {
      this.recordRouteEvent(newProps)
    }
  }
  recordRouteEvent (props) {
    const user = props.user
    const isSuperuser = user && user.isSuperuser
    const path = props.location.pathname
    let event = isSuperuser
        ? `Route (admin) ${path}`
        : `Route ${path}`
    recordEvent(event)
  }
  render () {
    return null
  }
}
