import React from 'react';
import ReactDOM from 'react-dom';
import mixpanel from 'mixpanel-browser';
import MixpanelProvider from 'react-mixpanel';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';


import App from './App';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

// todo - move token to a config file
mixpanel.init("0346f6d4a5e8caf80ac7fbcd8e73fa7e");
mixpanel.disable(); // todo REMOVE This for production !!

const history = createBrowserHistory();

ReactDOM.render(
    <MixpanelProvider mixpanel={mixpanel}>
    <Router history={history}>
        <App/>
    </Router>
    </MixpanelProvider>
), document.getElementById('root'));
registerServiceWorker();
