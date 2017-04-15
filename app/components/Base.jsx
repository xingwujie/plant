const Navbar = require('./Navbar');
const React = require('react');
const Footer = require('./Footer');
const PropTypes = require('prop-types');

class Base extends React.Component {

  render() {
    return (
      <div className='page'>
        <Navbar />
        <div id='main'>
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

Base.propTypes = {
  children: PropTypes.object,
};

module.exports = Base;
