import 'jquery';
import 'bootstrap';
import 'bootstrap.css';
import './stylesheets/main.css';

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
import React from 'react';
import Router from 'react-router';
import storage from './libs/storage';
import ReactDOM from 'react-dom';

import createBrowserHistory from 'history/lib/createBrowserHistory';

// var {Route, IndexRoute} = Router;
var {Route, IndexRoute} = Router;

// declare our routes and their hierarchy
var routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Home}/>
    <Route path='/add-plant' component={AddPlant}/>
    <Route path='/add-plant-note/:id' component={AddPlantNote}/>
    <Route path='/auth/token' component={Auth}/>
    <Route path='/login' component={Login}/>
    <Route path='/help' component={Help}/>
    <Route path='/profile' component={Profile}/>
  </Route>
);

let createHistory = createBrowserHistory();
function render() {
  ReactDOM.render(<Router history={createHistory}>{routes}</Router>, document.body);
}

function main() {
  persist(alt, storage, 'app');
  render();
}

main();
