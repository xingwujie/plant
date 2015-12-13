
import React from 'react';

export default class Errors extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const errors = this.props.errors;
    if(!errors || errors.length === 0) {
      return null;
    }

    return (
      <div className='errors'>
        {
          errors.map((error) => {
            return (<div>{error}</div>);
          })
        }
      </div>
    );
  }
}
