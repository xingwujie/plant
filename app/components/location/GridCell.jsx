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
    const { editId, rowId, data, title } = this.props;
    const { value, type } = data;
    const error = ''; // TODO: Determine error handling and communicating
    if (editId === rowId) {
      return (
        <InputCombo
          changeHandler={this.onChange}
          error={error}
          label={title}
          name={title}
          placeholder={title}
          style={{}}
          value={value}
          type={type}
        />
      );
    }
    return (<span>{this.props.data.value}</span>);
  }
}

GridCell.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  editCell: PropTypes.func.isRequired,
  editId: PropTypes.string,
  index: PropTypes.number.isRequired,
  rowId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

GridCell.defaultProps = {
  editId: '',
};

GridCell.defaultProps = {
  rows: [],
};

module.exports = GridCell;
