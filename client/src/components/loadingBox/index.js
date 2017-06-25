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
        setInterval(this.nextTick, 200)
    }

    nextTick = () => {
        this.setState({ticks: this.state.ticks + 1})
    }

    render () {
        if (!this.props.show) {
            return null
        }
        const dots = (new Array((this.state.ticks % 4) + 1)).join('.')
        return (
            <div className="loading-box">
                { Strings.loadingBox + dots }
            </div>
        )
    }
}
