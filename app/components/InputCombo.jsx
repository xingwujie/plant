const React = require('react');
const TextField = require('material-ui/TextField').default;
const PropTypes = require('prop-types');

class InputCombo extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let {
      changeHandler,
      disabled = false,
      error,
      fullWidth = true,
      label,
      multiLine = false,
      name: namo,
      placeholder,
      style = {},
      type = 'text',
      value,
    } = this.props || {};

    const underlineStyle = {
      display: 'none',
    };

    const styler = Object.assign({
      marginLeft: 20
    }, style);

    return (
      <TextField
        disabled={disabled}
        errorText={error}
        floatingLabelText={label}
        fullWidth={fullWidth}
        hintText={placeholder}
        multiLine={multiLine}
        name={namo}
        onChange={changeHandler}
        style={styler}
        type={type}
        underlineStyle={underlineStyle}
        value={value}
      />
    );
  }
}

InputCombo.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  error: PropTypes.string,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  multiLine: PropTypes.bool,
  name: PropTypes.string.isRequired, // eslint-disable-line no-dupe-keys
  placeholder: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.any.isRequired,
};

module.exports = InputCombo;
