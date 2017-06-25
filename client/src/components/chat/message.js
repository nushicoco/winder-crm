/**
 * Created by einavcarmon on 19/06/2017.
 */
import React, { Component } from 'react';
import Moment from 'moment';

export default class Message extends Component {

    renderSystemMessage() {
        return (<div><p className="system-message">{this.props.text}</p></div>)
    }

    renderMessage() {
        return (
        <div >
            <div className={this.props.isMe ?  "arrow-right arrow" : "arrow-left arrow" }></div>
            <div className={this.props.isMe ?  "right msg other-message" : "left msg my-message"}>
                <span className="author">{this.props.author }</span>
                <br/>
                <span className="msg-txt">{this.props.text}</span>
                <br/>
                <span className="msg-time">{Moment(this.props.time).format("D/M/YY H:mm")}</span>
            </div>
            <div className="dvider">
                <span>SomeLongTextHereSoWeWouldBreakALineMightBeAHackButIDontCare</span>
            </div>
        </div>
        )
    }

    render() {
        return this.props.author === "system"
            ? this.renderSystemMessage()
            : this.renderMessage();
    }
}