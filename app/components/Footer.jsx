const React = require('react');
// const Divider = require('material-ui/Divider').default;
const { Link } = require('react-router');

class Footer extends React.Component {
  render() {
    // const style = {
    //   bottom: 0,
    //   padding: '10px',
    //   width: '100%',
    // };

    return (
      <nav className="navbar navbar-default navbar-fixed-bottom">
        <div className="container-fluid">
          <Link to={'/'}>{'Home'}</Link>
          <Link style={{ marginLeft: '10px' }} to={'/privacy'}>{'Privacy'}</Link>
          <Link style={{ marginLeft: '10px' }} to={'/terms'}>{'Terms'}</Link>
        </div>
      </nav>
    );
  }
}

module.exports = Footer;
