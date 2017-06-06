import React from 'react';
import ReactDOM from 'react-dom';
import mixpanel from 'mixpanel-browser';
import MixpanelProvider from 'react-mixpanel';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';


import App from './App';
import { routes } from './routes';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

// This is only for production !!
// todo - move token to a config file
// mixpanel.init("0346f6d4a5e8caf80ac7fbcd8e73fa7e");

const history = createBrowserHistory();

ReactDOM.render(
    <MixpanelProvider mixpanel={mixpanel}>
    <Router history={history}>
        <div>
                <App/>
            {routes.map((route,index) => (
                <Route key={index} {...route} />
            ))}
        </div>
    </Router>
    </MixpanelProvider>
    , document.getElementById('root'));
registerServiceWorker();
