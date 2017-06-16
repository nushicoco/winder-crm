import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';


import App from './App';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

const history = createBrowserHistory();
ReactDOM.render(
    (
    <Router history={history}>
        <App/>
    </Router>
    ), document.getElementById('root'))
registerServiceWorker();
