const Base = require('../Base');
const React = require('react');

class Login extends React.Component {

  render() {
    const devLogin = process.env.NODE_ENV !== 'production';

    return (
      <Base>
        <div id='hero'>
          <div className='home-subheader'>
            {'By logging in or using the site you agree to our '}
            <a href='/terms' target='_blank'>{'terms & conditions'}</a>
            {'.'}
          </div>
          <div className='home-subheader'>
            <a href='/auth/facebook'>
              <img src='/img/facebook-login.png' />
            </a>
            <a href='/auth/google'>
              <img src='/img/google-login.png' />
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

module.exports = Login;
