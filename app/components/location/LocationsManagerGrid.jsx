// User grid editor

const AddIcon = require('material-ui/svg-icons/content/add').default;
const CancelSaveButtons = require('../common/CancelSaveButtons');
const EditDeleteButtons = require('../common/EditDeleteButtons');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const GridCell = require('./GridCell');
const Paper = require('material-ui/Paper').default;
const PropTypes = require('prop-types');
const React = require('react');

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
    const { id: deleteId } = deleteData;
    if (yes) {
      this.props.deleteRow(deleteId);
    } else {
      this.setState({ deleteId: '' });
    }
  }

  /**
   * Toggle a row from View (read-only) Mode to Edit Mode
   * @param {Object} editData - holds rowId of the row being switch to edit mode
   */
  editRow(editData) {
    // eslint-disable-next-line no-console
    console.log('LocationsManagerGrid.editRow', this.props, editData);
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
        const data = row.data.map((datum, index) => {
          if (colIndex === index) {
            return Object.assign({ ...datum }, { value });
          }
          return datum;
        });
        return Object.assign({ ...row }, { data });
      }
      return row;
    });
    this.setState({ rows });
  }

  cancelEdit() {
    // TODO: Need to restore the row's data from the props
    // eslint-disable-next-line no-console
    console.log('LocationsManagerGrid.cancelEdit');
    const { editId } = this.state;
    const propRow = this.props.rows.find(row => row._id === editId) || {};
    const rows = this.state.rows.map(row => (row._id === propRow._id ? propRow : row));
    this.setState({ editId: '', rows });
  }

  saveEdit() {
    // TODO: Need to call the callers's save method with this row's data
    // eslint-disable-next-line no-console
    console.log('LocationsManagerGrid.saveEdit');
    this.setState({ editId: '' });
  }

  render() {
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block',
    };

    const isOwner = true;

    const { headers, title } = this.props;
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
                headers.map(header => (
                  <TableHeaderColumn key={header.title}>{header.title}</TableHeaderColumn>
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
                    row.data.map((datum, index) => (
                      <TableRowColumn key={headers[index].title}>
                        <GridCell
                          data={datum}
                          editCell={this.editCell}
                          editId={editId}
                          index={index}
                          rowId={row._id}
                          title={headers[index].title}
                        />
                      </TableRowColumn>))
                  }
                  <TableRowColumn key={'action'}>
                    {editId === row._id
                      ? <CancelSaveButtons
                        clickSave={this.saveEdit}
                        clickCancel={this.cancelEdit}
                        mini
                        showButtons
                      />
                      : !editId && <EditDeleteButtons
                        clickDelete={this.checkDelete}
                        clickEdit={this.editRow}
                        confirmDelete={this.confirmDelete}
                        confirmMsg={'Really?'}
                        deleteTitle={''}
                        mini
                        showButtons={isOwner}
                        showDeleteConfirmation={deleteId === row._id}
                        deleteData={{ id: row._id }}
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
            title={`Add ${title}`}
            mini
          >
            <AddIcon />
          </FloatingActionButton>
        </div>
      </Paper>
    );
  }
}

LocationsManagerGrid.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
  })),
  headers: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  })).isRequired,
  title: PropTypes.string.isRequired,
  // dispatch: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
};

LocationsManagerGrid.defaultProps = {
  rows: [],
};

module.exports = LocationsManagerGrid;
