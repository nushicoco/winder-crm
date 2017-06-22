/**
 * Created by einavcarmon on 19/06/2017.
 */
import React, { Component } from 'react';
import { Popover } from 'react-bootstrap';

export default class Message extends Component {
    constructor (props) {
        super(props);

        this.state = {
            text: props.text,
            author: props.author,
            isMe: props.isMe
        }
    }

    render() {
        return (
        <div >
            <div className={this.state.isMe ?  "arrow-right arrow" : "arrow-left arrow" }></div>
            <div className={this.state.isMe ?  "right msg other-message" : "left msg my-message"}>
                <span className="author">{this.state.author }</span>
                <br/>
                <span className="msg-txt">{this.state.text}</span>
            </div>
            <div className="dvider">
                <span>SomeLongTextHereSoWeWouldBreakALineMightBeAHackButIDontCare</span>
            </div>
        </div>
        )
    }
}