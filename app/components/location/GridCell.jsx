// User grid editor

const InputCombo = require('../common/InputCombo');
const PropTypes = require('prop-types');
const React = require('react');
const CheckBox = require('material-ui/svg-icons/toggle/check-box').default;
const CheckBoxOutlineBlank = require('material-ui/svg-icons/toggle/check-box-outline-blank').default;

class GridCell extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, index, val) {
    const { type } = this.props;
    // console.log('GridCell.onChange', type, e.target.value, index, val);
    let value;
    switch (type) {
      case 'select':
        value = val;
        break;
      case 'boolean':
        value = index;
        break;
      default:
        value = e.target.value;
        break;
    }
    this.props.editCell(this.props.rowId, this.props.index, value);
  }

  render() {
    const { editId, rowId, value, type, title, options } = this.props;
    const error = ''; // TODO: Determine error handling and communicating
    if (editId === rowId) {
      return (
        <InputCombo
          changeHandler={this.onChange}
          error={error}
          name={title}
          options={options}
          placeholder={title}
          style={{}}
          type={type}
          value={value}
        />
      );
    }

    // eslint-disable-next-line no-nested-ternary
    if (type === 'boolean') {
      return value
        ? <CheckBox />
        : <CheckBoxOutlineBlank />;
    }

    let text = value;
    if (type === 'select') {
      text = options.find(option => option.value === value).text;
    }

    return (<span>{text}</span>);
  }
}

GridCell.propTypes = {
  editCell: PropTypes.func.isRequired,
  editId: PropTypes.string,
  index: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired),
  rowId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

GridCell.defaultProps = {
  editId: '',
  options: [],
};

GridCell.defaultProps = {
  rows: [],
};

module.exports = GridCell;
