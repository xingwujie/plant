import LoginStore from '../../stores/LoginStore';
import React from 'react';

export default (ComposedComponent) => {
  return class AuthenticatedComponent extends React.Component {

    constructor() {
      super();
      this.state = this.getLoginState();
      if(!this.state.userLoggedIn) {
        localStorage.setItem('returnurl', window.location);
        window.location = '/login';
      }
      this.onChange = this.onChange.bind(this);
    }

    getLoginState() {
      return {
        userLoggedIn: LoginStore.isLoggedIn(),
        user: LoginStore.user,
        jwt: LoginStore.jwt
      };
    }

    componentDidMount() {
      LoginStore.listen(this.onChange);
    }

    onChange() {
      this.setState(this.getLoginState());
    }

    componentWillUnmount() {
      LoginStore.unlisten(this.onChange);
    }

    render() {
      return (
      <ComposedComponent
        {...this.props}
        user={this.state.user}
        jwt={this.state.jwt}
        userLoggedIn={this.state.userLoggedIn} />
      );
    }
  };
};
