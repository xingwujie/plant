// User grid editor

const React = require('react');
const PropTypes = require('prop-types');
const Paper = require('material-ui/Paper').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const AddIcon = require('material-ui/svg-icons/content/add').default;
const EditDeleteButtons = require('../common/EditDeleteButtons');

const {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} = require('material-ui/Table');

class LocationsManagerGrid extends React.Component {
  constructor() {
    super();
    this.checkDelete = this.checkDelete.bind(this);
    this.editRow = this.editRow.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  checkDelete(deleteData) {
    const { id: deleteId } = deleteData;
    this.setState({
      deleteId,
    });
  }

  confirmDelete(yes, deleteData) {
    const { id: deleteId } = deleteData;
    if (yes) {
      this.props.deleteRow(deleteId);
    } else {
      this.setState({ deleteId: '' });
    }
  }

  editRow(editData) {
    // eslint-disable-next-line no-console
    console.log('LocationsManagerGrid.editRow', this.props, editData);
  }

  render() {
    const { rows, headers, title } = this.props;
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block',
    };

    const isOwner = true;
    const {
      deleteId,
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
                  {row.data.map(datum => (<TableRowColumn key={datum}>{datum}</TableRowColumn>)) }
                  <TableRowColumn key={'action'}>
                    <EditDeleteButtons
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
