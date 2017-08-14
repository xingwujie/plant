const React = require('react');
const TextField = require('material-ui/TextField').default;
const PropTypes = require('prop-types');

function inputCombo(props = {}) {
  const {
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
  } = props;

  const underlineStyle = {
    display: 'none',
  };

  const styler = Object.assign({
    marginLeft: 20,
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

inputCombo.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  multiLine: PropTypes.bool,
  name: PropTypes.string.isRequired, // eslint-disable-line no-dupe-keys
  placeholder: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  type: PropTypes.string,
};

inputCombo.defaultProps = {
  disabled: false,
  error: '',
  fullWidth: true,
  label: '',
  multiLine: false,
  placeholder: '',
  style: {},
  type: 'text',
};

module.exports = inputCombo;
