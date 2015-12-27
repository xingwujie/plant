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

    store.dispatch(actions.loginRequest(code));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange(){
    this.setState(store.getState().user);
  }

  componentDidUpdate() {
    const jwt = _.get(this, 'state.user.jwt', '');
    if(jwt) {
      const returnurl = localStorage.getItem('returnurl');
      if(returnurl) {
        localStorage.removeItem('returnurl');
      }
      let destination = returnurl || '/';
      let { history: historyContext } = this.props;
      historyContext.pushState(null, destination);
    } else {
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
