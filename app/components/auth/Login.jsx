import Base from '../Base';
import React from 'react';

export default class Login extends React.Component {

  render() {
    const devLogin = process.env.NODE_ENV !== 'production';

    return (
      <Base>
        <div id='hero'>
          <div className='home-subheader'>
            <a href='/auth/facebook'>
              <img src='/img/facebook-login.png' />
            </a>
          </div>
          {devLogin &&
            <div className='home-subheader'>
              <a href='/auth/dev'>
                {'Developer Login'}
              </a>
            </div>
          }
        </div>
      </Base>
    );
  }
}
