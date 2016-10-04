
const React = require('react');

class Errors extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const errors = this.props.errors;
    if(!errors || errors.length === 0) {
      return null;
    }

    return (
      <div className='errors bg-danger col-xs-12 col-sm-8 col-md-6'>
        {
          errors.map((error, index) => {
            return (<div key={index}>{error}</div>);
          })
        }
      </div>
    );
  }
}

Errors.propTypes = {
  errors: React.PropTypes.array,
};

module.exports = Errors;
