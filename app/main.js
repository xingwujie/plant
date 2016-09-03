import 'jquery';
import 'bootstrap';
import 'bootstrap.css';
import './stylesheets/main.css';

import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import {deepOrange500} from 'material-ui/styles/colors';
import App from './components/App';
import Auth from './components/Auth';
import DebugSettings from './components/DebugSettings';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Help from './components/Help';
import Home from './components/Home';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Login from './components/auth/Login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Plant from './components/plant/Plant';
import Plants from './components/plants/Plants';
import Privacy from './components/info/Privacy';
import Profile from './components/Profile';
import React from 'react';
import ReactDOM from 'react-dom';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

injectTapEventPlugin();

// TODO: Put a Not Found / No Match component in here.
var routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Home}/>
    <Route path='/auth/token' component={Auth}/>
    <Route path='/debug-settings' component={DebugSettings}/>
    <Route path='/help' component={Help}/>
    <Route path='/login' component={Login}/>
    <Route path='/plant' component={Plant}/>
    <Route path='/plant/:slug/:id' component={Plant}/>
    <Route path='/plants/:slug/:id' component={Plants}/>
    <Route path='/privacy' component={Privacy}/>
    <Route path='/profile' component={Profile}/>
    <Route path='*' component={Help}/>
  </Route>
);

function render() {
  let content = document.createElement('div');
  document.body.appendChild(content);

  ReactDOM.render((
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={browserHistory}>{routes}</Router>
    </MuiThemeProvider>
  ), content);

}

function main() {
  render();
}

main();
