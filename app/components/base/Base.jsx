const Navbar = require('./Navbar');
const React = require('react');
const Footer = require('./Footer');
const PropTypes = require('prop-types');

function base(props) {
  return (
    <div className="page">
      <Navbar />
      <div id="main">
        {props.children}
      </div>
      <Footer />
    </div>
  );
}

base.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.object.isRequired,
};

module.exports = base;
