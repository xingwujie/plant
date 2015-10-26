import Base from '../Base';
import React from 'react';

export default class ManagePlant extends React.Component {

  componentDidMount() {
  }

  render() {
    console.log('props:', this.props);
    console.log('state:', this.state);

    return (
      <Base>
        <h2>Manage Plant</h2>
      </Base>
    );
  }
}
