// import AltContainer from 'alt/AltContainer';
import Base from './Base';
import Footer from './Footer';
// import PlantStore from '../stores/PlantStore';
import React from 'react';

export default class Profile extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <Base>
        <div>
          User Profile
        </div>
        <Footer />
      </Base>
    );
  }
}
