const React = require('react');
const TextField = require('material-ui/TextField').default;

class InputCombo extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let {
      error,
      label,
      value,
      placeholder,
      changeHandler
    } = this.props || {};

    const underlineStyle = {
      display: 'none',
    };

    const style = {
      marginLeft: 20
    };

    return (
      <TextField
        errorText={error}
        floatingLabelText={label}
        hintText={placeholder}
        onChange={changeHandler}
        style={style}
        underlineStyle={underlineStyle}
        value={value}
        fullWidth={true}
      />
    );
  }
}

module.exports = InputCombo;
