// User grid editor

const React = require('react');
const PropTypes = require('prop-types');
const InputCombo = require('../common/InputCombo');

class GridCell extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { value } = e.target;
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
          label={title}
          name={title}
          options={options}
          placeholder={title}
          style={{}}
          type={type}
          value={value}
        />
      );
    }
    return (<span>{this.props.value}</span>);
  }
}

GridCell.propTypes = {
  editCell: PropTypes.func.isRequired,
  editId: PropTypes.string,
  index: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.string.isRequired),
  rowId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

GridCell.defaultProps = {
  editId: '',
  options: [],
};

GridCell.defaultProps = {
  rows: [],
};

module.exports = GridCell;
