import React from 'react';
import Divider from 'material-ui/lib/divider';
import {Link} from 'react-router';

export default class Footer extends React.Component {
  render() {
    const style = {
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      padding: '10px',
      backgroundColor: '#efefef',
    };

    return (
      <div style={style}>
        <Divider />
        <Link to={`/`}>{'Home'}</Link>
        <Link style={{marginLeft: '10px'}} to={`/privacy`}>{'Privacy'}</Link>
      </div>
    );
  }
}
