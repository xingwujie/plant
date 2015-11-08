import Base from './Base';
import React from 'react';
import LogLifecyle from 'react-log-lifecycle';

const flags = {
  logType: '',
  names: ['props', 'nextProps', 'nextState', 'prevProps', 'prevState']
};

export default class Help extends LogLifecyle {
  constructor(props) {
    super(props, flags);
  }
  render() {

    console.log('Help render');

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
