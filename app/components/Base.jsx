import Navbar from './Navbar';
import React from 'react';
import Footer from './Footer';

export default class Base extends React.Component {

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
  children: React.PropTypes.object,
};
