import React from 'react'
import './LoadingBox.css'
import Strings from '../../strings'
export default class LoadingBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ticks: 0
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.nextTick, 200)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }

    nextTick = () => {
        this.setState({ticks: this.state.ticks + 1})
    }

    renderError() {
        return (
            <div className="loading-box-error">
                { Strings.loadingBox.error }
            </div>
        )
    }

    render () {
        if (!this.props.show) {
            return <div> { this.props.children } </div>
        }

        if (this.props.show === 'error') {
            return this.renderError()
        }

        const dots = (new Array((this.state.ticks % 4) + 1)).join('.')
        return (
            <div className="loading-box">
                { Strings.loadingBox.loading + dots }
            </div>
        )
    }
}
