const React = require('react');
const Divider = require('material-ui/Divider').default;
const {Link} = require('react-router');

class Footer extends React.Component {
  render() {
    const style = {
      bottom: 0,
      padding: '10px',
      width: '100%',
    };

    return (
      <footer style={style}>
        <Divider />
        <Link to={'/'}>{'Home'}</Link>
        <Link style={{marginLeft: '10px'}} to={'/privacy'}>{'Privacy'}</Link>
        <Link style={{marginLeft: '10px'}} to={'/terms'}>{'Terms'}</Link>
      </footer>
    );
  }
}

module.exports = Footer;
