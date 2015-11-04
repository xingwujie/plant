import _ from 'lodash';
import Base from './Base';
import LoginActions from '../actions/LoginActions';
import LoginStore from '../stores/LoginStore';
import React from 'react';

export default class Auth extends React.Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    LoginStore.listen(this.onChange);
    console.log('this.props:', this.props);

    let { query } = this.props.location;
    var code = query && query.jwt;

    LoginActions.login(code);
  }

  componentWillUnmount() {
    LoginStore.unlisten(this.onChange);
  }

  onChange(user){
    this.setState(user);
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
