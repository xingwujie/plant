import 'jquery';
import 'bootstrap';
import 'bootstrap.css';
import './stylesheets/main.css';

import alt from './libs/alt';
import App from './components/App';
import Auth from './components/Auth';
import Help from './components/Help';
import Home from './components/Home';
// import ManagePlant from './components/plant/ManagePlant';
import AddPlant from './components/plant/AddPlant';
import AddPlantNote from './components/plant/AddPlantNote';
import persist from './libs/persist';
import Profile from './components/Profile';
import React from 'react';
import Router from 'react-router';
import storage from './libs/storage';

var {Route, DefaultRoute} = Router;

// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <DefaultRoute name='home' handler={Home}/>
    <Route path='/add-plant' handler={AddPlant}/>
    <Route path='/add-plant-note/:id' handler={AddPlantNote}/>
    <Route path='/auth/token' handler={Auth}/>
    <Route path='/help' handler={Help}/>
    <Route path='/profile' handler={Profile}/>
  </Route>
);

function render() {
  Router.run(routes, Router.HistoryLocation, (Root) => {
    React.render(<Root/>, document.body);
  });
}

function main() {
  persist(alt, storage, 'app');
  render();
}

main();
