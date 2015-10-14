import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <div id='header'>
        <div id='title'>
          <h1>Plant</h1>
        </div>
        <div id='menucontainer'>
          <ul id='menu'>
            <li>
              <a href='#'>Home</a>
            </li>
            <li>
              <a href='#'>An item #1</a>
            </li>
            <li>
              <a href='#help'>Help</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
