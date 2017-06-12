const Base = require('./Base');
const React = require('react');

class Help extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Base>
        <div className="well">
          <h3 className="well">Need Help?</h3>
          <p>Please ask your questions on <a target="_blank" href="https://www.facebook.com/groups/589635491185478/">Fruit Trees Anonymous</a>.</p>
        </div>
      </Base>
    );
  }
}

module.exports = Help;
