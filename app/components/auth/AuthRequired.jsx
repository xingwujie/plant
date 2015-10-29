import LoginStore from '../../stores/LoginStore';
import React from 'react';

export default (ComposedComponent) => {
  return class AuthenticatedComponent extends React.Component {

    static willTransitionTo(transition) {
      if (!LoginStore.isLoggedIn()) {
        transition.redirect(`/login`);
      }
    }

    constructor() {
      super();
      this.state = this.getLoginState();
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
