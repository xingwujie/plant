import Base from './Base';
import React from 'react';

export default class Help extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    return (
      <Base>
        <div className='well'>
          <h3 className='well'>Add Plant</h3>
          <p>Login and click the Add menu to add a plant.</p>
        </div>
      </Base>
    );
  }
}
