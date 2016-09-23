import Base from './Base';
import React from 'react';
import store from '../store';
import * as actions from '../actions';

export default class Auth extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

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
    const {jwt = ''} = this.state || {};
    if(jwt) {
      const returnurl = localStorage.getItem('returnurl');
      if(returnurl) {
        localStorage.removeItem('returnurl');
      }
      let destination = returnurl || '/';
      this.context.router.push(destination);
    } else {
      this.context.router.push('/login');
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

Auth.propTypes = {
  location: React.PropTypes.object,
};
