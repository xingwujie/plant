import _ from 'lodash';
import Base from './Base';
import React from 'react';
import store from '../store';
import * as actions from '../actions';

export default class Auth extends React.Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.onChange);

    let { query } = this.props.location;
    var code = query && query.jwt;

    console.log('Auth.componentDidMount query:', query);

    store.dispatch(actions.loginRequest(code));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange(){
    console.log('Auth.onChange store.getState().user:', store.getState().user);
    this.setState(store.getState().user);
  }

  componentDidUpdate() {
    console.log('Auth.componentDidUpdate this.state:', this.state);
    const jwt = _.get(this, 'state.jwt', '');
    if(jwt) {
      const returnurl = localStorage.getItem('returnurl');
      if(returnurl) {
        localStorage.removeItem('returnurl');
      }
      let destination = returnurl || '/';
      let { history: historyContext } = this.props;
      console.log('Auth.componentDidUpdate destination:', destination);
      historyContext.pushState(null, destination);
    } else {
      console.log('Auth.componentDidUpdate /login');
      window.location = '/login';
    }
  }

  render() {
    return (
      <Base>
          <h2>Authenticating...</h2>
      </Base>
    );
  }
}
