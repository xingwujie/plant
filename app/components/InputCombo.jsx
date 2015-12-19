import React from 'react';

export default class InputCombo extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let {
      error,
      label,
      extraClasses,
      value,
      placeholder,
      changeHandler
    } = this.props || {};

    return (
      <div className={`form-group title-input-combo col-xs-12 ${extraClasses ? extraClasses : ''} ${error ? 'has-error' : ''}`}>
        <label className='control-label'>{label}{error ? ` (${error})` : ''}:</label>
        <input className={`form-control`}
          type='text' value={value}
          placeholder={placeholder}
          onChange={changeHandler} />
      </div>

    );
  }
}
