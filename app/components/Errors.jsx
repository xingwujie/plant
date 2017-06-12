
const React = require('react');
const PropTypes = require('prop-types');

class Errors extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let { errors } = this.props || {};
    if (!errors || !errors.length) {
      return null;
    }

    if (typeof errors === 'string') {
      errors = [errors];
    }

    return (
      <div className="btn btn-danger" style={{ margin: 10 }}>
        {
          errors.map((error, index) => (<div key={index}>{error}</div>))
        }
      </div>
    );
  }
}

Errors.propTypes = {
  errors: PropTypes.array,
};

module.exports = Errors;
