import 'jquery';
import 'bootstrap';
import 'bootstrap.css';
import './stylesheets/main.css';

// import _ from 'lodash';
import AddPlant from './components/plant/AddPlant';
import AddPlantNote from './components/plant/AddPlantNote';
import alt from './libs/alt';
import App from './components/App';
import Auth from './components/Auth';
import Help from './components/Help';
import Home from './components/Home';
import Login from './components/auth/Login';
import persist from './libs/persist';
import Profile from './components/Profile';
// import queryString from 'query-string';
import React from 'react';
import ReactDOM from 'react-dom';
import storage from './libs/storage';

import createBrowserHistory from 'history/lib/createBrowserHistory';

import {Router, Route, IndexRoute} from 'react-router';

var routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Home}/>
    <Route path='/add-plant-note/:id' component={AddPlantNote}/>
    <Route path='/add-plant' component={AddPlant}/>
    <Route path='/auth/token' component={Auth}/>
    <Route path='/help' component={Help}/>
    <Route path='/login' component={Login}/>
    <Route path='/profile' component={Profile}/>
    // TODO: Put a Not Found / No Match component in here.
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
