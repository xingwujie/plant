import Base from '../Base';
import React from 'react';

export default class App extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <Base>
        <div id='hero'>
          <div className='home-subheader'>
            <a href='/auth/facebook'>
              <img src='/img/facebook-login.png' />
            </a>
          </div>
        </div>
      </Base>
    );
  }
}
