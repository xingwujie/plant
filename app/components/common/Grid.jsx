// User grid editor

const AddIcon = require('material-ui/svg-icons/content/add').default;
const CancelSaveButtons = require('./CancelSaveButtons');
const EditDeleteButtons = require('./EditDeleteButtons');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const GridCell = require('./GridCell');
const Paper = require('material-ui/Paper').default;
const PropTypes = require('prop-types');
const React = require('react');
const utils = require('../../libs/utils');

const {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} = require('material-ui/Table');

class LocationsManagerGrid extends React.Component {
  constructor(props) {
    super(props);
    this.addNewRow = this.addNewRow.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.checkDelete = this.checkDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.editCell = this.editCell.bind(this);
    this.editRow = this.editRow.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    // We need to keep a reference of these rows because this component is going
    // to manager the editing and state of the rows from here onwards.
    this.state = {
      rows: props.rows,
    };
  }

  /**
   * The delete button on a row was clicked. Set a flag to switch the Edit/Delete
   * button pair to Cancel/Delete button pair to confirm the delete action.
   * @param {Object} deleteData - data needed to identify row to be deleted
   */
  checkDelete(deleteData) {
    const { id: deleteId } = deleteData;
    this.setState({
      deleteId,
    });
  }

  /**
   * The "Confirm Delete" or "Cancel Delete" was clicked. Either delete the row or restore
   * the Edit/Delete button pair.
   * @param {Boolean} yes - True if delete was confirmed. False if cancel was clicked
   * @param {Object} deleteData  - data needed to identify row to be deleted
   */
  confirmDelete(yes, deleteData) {
    if (yes) {
      this.props.delete(deleteData);
      const { id } = deleteData;
      const { rows } = this.state;
      this.setState({
        rows: rows.filter(row => row._id !== id),
      });
    } else {
      this.setState({ deleteId: '' });
    }
  }

  /**
   * Toggle a row from View (read-only) Mode to Edit Mode
   * @param {Object} editData - holds rowId of the row being switch to edit mode
   */
  editRow(editData) {
    this.setState({
      editId: editData.id,
    });
  }

  /**
   * Change the value in a row/colum in the rows collection.
   * aka edit a cell in the grid
   * @param {String} rowId - UUID of the row being edited
   * @param {Number} colIndex - Integer index of column being edited
   * @param {String} value - New value for the cell
   */
  editCell(rowId, colIndex, value) {
    const rows = this.state.rows.map((row) => {
      if (row._id === rowId) {
        const values = row.values.map((currentValue, index) => {
          if (colIndex === index) {
            return value;
          }
          return currentValue;
        });
        return Object.assign({ ...row }, { values });
      }
      return row;
    });
    this.setState({ rows });
  }

  /**
   * If we're canceling the editing of a new row then we want to completely
   * remove that row. If we're editing an existing row then we want to restore
   * the values from the props to that row in the state.
   */
  cancelEdit() {
    const { editId, newRow = false } = this.state;
    let rows;
    if (newRow) {
      rows = this.state.rows.filter(row => (row._id !== editId));
    } else {
      const propRow = this.props.rows.find(row => row._id === editId) || {};
      rows = this.state.rows.map(row => (row._id === propRow._id ? propRow : row));
    }
    this.setState({ editId: '', rows, newRow: false });
  }

  saveEdit() {
    const { rows, editId, newRow } = this.state;
    const editRow = rows.find(row => row._id === editId);
    if (newRow) {
      this.props.insert(editRow);
    } else {
      this.props.update(editRow);
    }
    this.setState({ editId: '', newRow: false });
  }

  addNewRow() {
    const { columns: cols } = this.props;
    const editId = utils.makeMongoId();
    const row = {
      _id: editId,
      values: cols.map((col) => {
        switch (col.type) {
          case 'text':
            return '';
          case 'boolean':
            return true;
          default:
            // eslint-disable-next-line no-console
            console.warn('Unknown type in addNewRow', col.typ);
            return '';
        }
      }),
    };
    const rows = this.state.rows.concat(row);
    this.setState({ rows, editId, newRow: true });
  }

  render() {
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block',
    };

    const isOwner = true;

    const { columns, title } = this.props;
    const {
      rows,
      deleteId, // If has a value then in process of confirming delete of this row
      editId, // If has value then currently editing this row
    } = this.state || {};

    return (
      <Paper
        key={location._id}
        style={paperStyle}
        zDepth={5}
      >
        <h5>{title}</h5>
        <Table>
          <TableHeader
            adjustForCheckbox={false}
            displayRowCheckbox={false}
            displaySelectAll={false}
          >
            <TableRow>
              {
                columns.map(column => (
                  <TableHeaderColumn key={column.title}>{column.title}</TableHeaderColumn>
                ))
              }
              <TableHeaderColumn key={'action'}>{'Action'}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              rows.map(row => (
                <TableRow key={row._id}>
                  {
                    row.values.map((value, index) => (
                      <TableRowColumn key={columns[index].title}>
                        <GridCell
                          editCell={this.editCell}
                          editId={editId}
                          index={index}
                          options={columns[index].options}
                          rowId={row._id}
                          title={columns[index].title}
                          type={columns[index].type}
                          value={value}
                        />
                      </TableRowColumn>))
                  }
                  <TableRowColumn key={'action'}>
                    {editId === row._id
                      ? <CancelSaveButtons
                        clickCancel={this.cancelEdit}
                        clickSave={this.saveEdit}
                        mini
                        showButtons
                      />
                      : <EditDeleteButtons
                        clickDelete={this.checkDelete}
                        clickEdit={this.editRow}
                        confirmDelete={this.confirmDelete}
                        confirmMsg={'Really?'}
                        deleteData={{ id: row._id }}
                        deleteTitle={''}
                        disabled={!!editId}
                        mini
                        showButtons={isOwner}
                        showDeleteConfirmation={deleteId === row._id}
                      />
                    }
                  </TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <div style={{ textAlign: 'right' }}>
          <FloatingActionButton
            disabled={!!editId}
            mini
            onClick={this.addNewRow}
            title={`Add ${title}`}
          >
            <AddIcon />
          </FloatingActionButton>
        </div>
      </Paper>
    );
  }
}

LocationsManagerGrid.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired),
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  })).isRequired,
  delete: PropTypes.func.isRequired,
  insert: PropTypes.func.isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
  })),
  title: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
};

LocationsManagerGrid.defaultProps = {
  rows: [],
};

module.exports = LocationsManagerGrid;
