import Base from './Base';
import React from 'react';
import ReactDebugSettings from './ReactDebugSettings';

export default class DebugSettings extends React.Component {


  render() {
    const settings = [{
      name: 'redux',
      description: 'Calls to Redux dispatch'
    }];
    return (
      <Base>
        <ReactDebugSettings setting={settings} />
      </Base>
    );
  }
}
