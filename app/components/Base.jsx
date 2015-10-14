import Navbar from './Navbar';
import React from 'react';

export default class Base extends React.Component {

  render() {
    return (
      <div className='page'>
        <Navbar />
        <div id='main'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
