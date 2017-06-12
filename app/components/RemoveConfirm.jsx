const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const ClearIcon = require('material-ui/svg-icons/content/clear').default;
const DeleteForeverIcon = require('material-ui/svg-icons/action/delete-forever').default;
const PropTypes = require('prop-types');

class RemoveConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.reallyDelete = this.reallyDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }

  reallyDelete() {
    this.props.confirmFn(true);
  }

  cancelDelete() {
    this.props.confirmFn(false);
  }

  render() {
    const { title = '' } = this.props || {};

    return (
      <div style={{ textAlign: 'right' }}>
        <strong className="lead">{'Really delete? (This cannot be undone.)'}</strong>
        <FloatingActionButton
          onClick={this.cancelDelete}
          secondary
          style={{ marginLeft: '10px' }}
          title="Cancel"
        >
          <ClearIcon />
        </FloatingActionButton>
        <FloatingActionButton
          onClick={this.reallyDelete}
          style={{ marginLeft: '10px' }}
          title={`Delete ${title}`}
        >
          <DeleteForeverIcon />
        </FloatingActionButton>
      </div>
    );
  }
}

RemoveConfirm.propTypes = {
  confirmFn: PropTypes.func.isRequired,
  title: PropTypes.string,
};

module.exports = RemoveConfirm;
