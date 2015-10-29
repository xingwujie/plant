import Base from '../Base';
import React from 'react';

export default class App extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <Base>
        <h1>Login</h1>
        <div>
          <a href='/auth/facebook'>{'Login with Facebook'}</a>
        </div>
      </Base>
    );
  }
}
