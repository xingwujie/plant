import Base from '../Base';
import React from 'react';
import d from 'debug';

const debug = d('plant:ManagePlant');

export default class ManagePlant extends React.Component {

  componentDidMount() {
  }

  render() {
    debug('props:', this.props);
    debug('state:', this.state);

    return (
      <Base>
        <h2>Manage Plant</h2>
      </Base>
    );
  }
}
