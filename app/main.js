import 'jquery';
import 'bootstrap';
import 'bootstrap.css';
import './stylesheets/main.css';

import _ from 'lodash';
import alt from './libs/alt';
import Auth from './components/Auth';
import Home from './components/Home';
import persist from './libs/persist';
import React from 'react';
import storage from './libs/storage';
import ReactDOM from 'react-dom';
import queryString from 'query-string';

function render() {
  var content = document.createElement('div');
  content.setAttribute('id', 'content');
  document.body.appendChild(content);
  content = document.getElementById('content');

  let pathname = _.get(window, 'location.pathname', '');
  if(pathname.indexOf('/auth/token') >= 0) {
    let search = _.get(window, 'location.search', '');
    let query = queryString.parse(search);
    ReactDOM.render(<Auth query={query}/>, content);
  } else {
    ReactDOM.render(<Home />, content);
  }
}

function main() {
  persist(alt, storage, 'app');
  render();
}

main();
