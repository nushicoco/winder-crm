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

// todo - move token to a config file
console.log(process.env.REACT_APP_MIXPANEL_TOKEN);
// mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN); //- doesn't work yet
mixpanel.init("0346f6d4a5e8caf80ac7fbcd8e73fa7e");

if (process.env.NODE_ENV !== 'production') {
    console.log("disabling mixpanel")
    mixpanel.disable();
}

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
