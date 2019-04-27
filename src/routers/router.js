import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Login from '../pages/user/login';
import Forget from '../pages/user/forget';
import Index from '../pages/account/index';
const history = createBrowserHistory();
export default class Routers extends Component {

    constructor(props, context) {
        super(props);
        console.log(props);
    }
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route
                        exact
                        path="/"
                        component={Login}
                    >
                    </Route>
                    <Route
                        exact
                        path="/forget"
                        component={Forget}
                    />
                    <Route
                        exact
                        path="/index"
                        component={Index}
                    />
                </Switch>
            </Router>
        )
    }
}

