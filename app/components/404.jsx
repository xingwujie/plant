const Base = require('./Base');
const React = require('react');

class Help extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    return (
      <Base>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-6 col-sm-offset-3'>
              <section id='oops' className='row'>
                <div className='col-sm-6'>
                  <img src='/img/mango.gif' className='img-responsive' />
                </div>

                <div className='col-sm-6'>
                  <h1>404</h1>
                  <p>We could not find the page you were looking for. Please check the link and try again.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Base>
    );
  }
}

module.exports = Help;
