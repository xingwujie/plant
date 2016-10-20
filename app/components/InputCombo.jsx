const React = require('react');
const TextField = require('material-ui/TextField').default;

class InputCombo extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let {
      changeHandler,
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
  changeHandler: React.PropTypes.func.isRequired,
  error: React.PropTypes.string,
  fullWidth: React.PropTypes.bool,
  label: React.PropTypes.string,
  multiLine: React.PropTypes.bool,
  name: React.PropTypes.string.isRequired, // eslint-disable-line no-dupe-keys
  placeholder: React.PropTypes.string,
  style: React.PropTypes.object,
  value: React.PropTypes.any.isRequired,
};

module.exports = InputCombo;
