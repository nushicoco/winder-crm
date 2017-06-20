/**
 * Created by einavcarmon on 19/06/2017.
 */
import React, { Component } from 'react';

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
        <div className={this.state.isMe ? "left" : "right"}>
            <p>{this.state.author } : {this.state.text}</p>
        </div>
        )
    }
}