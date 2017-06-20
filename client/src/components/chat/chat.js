/**
 * Created by einavcarmon on 19/06/2017.
 */

import React, { Component } from 'react';


import './chat.css'
import ChatTab from "./chatTab";

export default class chatTab extends Component {
    constructor (props) {
        super(props);

        this.state = {
            chats : [],
            client: props.match.params.client
        }
    }

    render() {
        return (
            <div className="all-over">
                <div className="tabs">

                    <nav role='navigation' className="transformer-tabs">
                        <ul>
                            <li><a href="#tab-1">Important Tab</a></li>
                        </ul>
                    </nav>
                    <div id="tab-1">
                        { /* todo change the chatId */ }
                        <ChatTab chatId="1" client={ this.state.client }></ChatTab>
                    </div>
                </div>
            </div>
        )
    }
}
