// User grid editor

const React = require('react');
const PropTypes = require('prop-types');

const {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} = require('material-ui/Table');

function locationsManagerGrid(props) {
  const { rows, headers, title } = props;

  return (
    <div>
      <h5>{title}</h5>
      <Table>
        <TableHeader>
          <TableRow>
            {
              headers.map(header => (
                <TableHeaderColumn key={header.title}>{header.title}</TableHeaderColumn>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            rows.map(row => (
              <TableRow key={row._id}>
                {row.data.map(datum => (<TableRowColumn key={datum}>{datum}</TableRowColumn>)) }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}

locationsManagerGrid.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
  })),
  headers: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  })).isRequired,
  title: PropTypes.string.isRequired,
};

locationsManagerGrid.defaultProps = {
  rows: [],
};

module.exports = locationsManagerGrid;
