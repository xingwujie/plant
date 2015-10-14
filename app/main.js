import 'jquery';
import 'bootstrap';
import 'bootstrap.css';
import './stylesheets/main.css';

import alt from './libs/alt';
import App from './components/App';
import Help from './components/Help';
import Home from './components/Home';
import persist from './libs/persist';
import React from 'react';
import Router from 'react-router';
import storage from './libs/storage';

var {Route, DefaultRoute} = Router;

// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Home}/>
    <Route path='help' handler={Help}/>
  </Route>
);

function render() {
  Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.body);
  });
}

function main() {
  persist(alt, storage, 'app');
  render();
}

main();
