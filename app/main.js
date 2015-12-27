import 'jquery';
import 'bootstrap';
import 'bootstrap.css';
import './stylesheets/main.css';

import {Router, Route, IndexRoute} from 'react-router';
import alt from './libs/alt';
import App from './components/App';
import Auth from './components/Auth';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Help from './components/Help';
import Home from './components/Home';
import Login from './components/auth/Login';
import persist from './libs/persist';
import Plant from './components/plant/Plant';
import Plants from './components/plants/Plants';
import Profile from './components/Profile';
import React from 'react';
import ReactDOM from 'react-dom';
import storage from './libs/storage';

// TODO: Put a Not Found / No Match component in here.
var routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Home}/>
    <Route path='/auth/token' component={Auth}/>
    <Route path='/help' component={Help}/>
    <Route path='/login' component={Login}/>
    <Route path='/plant' component={Plant}/>
    <Route path='/plant/:slug/:id' component={Plant}/>
    <Route path='/plants' component={Plants}/>
    <Route path='/profile' component={Profile}/>
    <Route path='*' component={Help}/>
  </Route>
);

let createHistory = createBrowserHistory();
function render() {
  var content = document.createElement('div');
  content.setAttribute('id', 'content');
  document.body.appendChild(content);
  content = document.getElementById('content');

  ReactDOM.render((<Router history={createHistory}>{routes}</Router>), content);

  // let pathname = _.get(window, 'location.pathname', '');
  // if(pathname.indexOf('/auth/token') >= 0) {
  //   let search = _.get(window, 'location.search', '');
  //   let query = queryString.parse(search);
  //   ReactDOM.render(<Auth query={query}/>, content);
  // } else {
  //   ReactDOM.render(<Home />, content);
  // }
}

function main() {
  persist(alt, storage, 'app');
  render();
}

main();
