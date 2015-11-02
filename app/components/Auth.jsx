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

    var code = _.get(this.props, 'query.jwt', '');

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
      // TODO: Store in localStorage the original URL that the user wanted
      // to go to and do a redirect to that here.
      window.location = '/';
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
