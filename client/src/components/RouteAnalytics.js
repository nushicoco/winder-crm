import React from 'react'
import { recordEvent } from '../analytics'

export default class RouteAnalytics extends React.Component {
  componentWillReceiveProps (newProps) {
    const user = newProps.user
    const isSuperuser = user && user.isSuperuser
    const path = newProps.location.pathname
    let event = isSuperuser
        ? `Route (admin) ${path}`
        : `Route ${path}`
    recordEvent(event)
  }
  render () {
    return null
  }
}
