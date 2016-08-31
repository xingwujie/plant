import React from 'react';
import Divider from 'material-ui/Divider';
import {Link} from 'react-router';

export default class Footer extends React.Component {
  render() {
    const style = {
      backgroundColor: '#efefef',
      bottom: 0,
      padding: '10px',
      position: 'fixed',
      width: '100%',
    };

    return (
      <footer style={style}>
        <Divider />
        <Link to={'/'}>{'Home'}</Link>
        <Link style={{marginLeft: '10px'}} to={'/privacy'}>{'Privacy'}</Link>
      </footer>
    );
  }
}
