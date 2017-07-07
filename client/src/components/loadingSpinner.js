import React from 'react'
import './loadingSpinner.css'
import Strings from '../strings'

export default class LoadingSpinner extends React.Component {
  render () {
    return (
      <div style={{ display: this.props.show ? 'block' : 'none' }}
        className='loading'>
        { Strings.loading }&#8230;
            </div>
    )
  }
}
