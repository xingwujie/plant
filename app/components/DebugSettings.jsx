const Base = require('./Base');
const React = require('react');
const ReactDebugSettings = require('./ReactDebugSettings');

class DebugSettings extends React.Component {

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

module.exports = DebugSettings;
