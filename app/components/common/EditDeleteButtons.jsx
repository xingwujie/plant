const React = require('react');
const RemoveConfirm = require('./RemoveConfirm');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const EditIcon = require('material-ui/svg-icons/editor/mode-edit').default;
const DeleteIcon = require('material-ui/svg-icons/action/delete').default;
const PropTypes = require('prop-types');

function editDeleteButtons(props) {
  const {
    showButtons,
    showDeleteConfirmation,
  } = props;

  if (!showButtons) {
    return null;
  }

  function onClickDelete() {
    props.clickDelete(props.deleteData);
  }

  function onClickEdit() {
    props.clickEdit(props.deleteData);
  }

  return (
    <h2 className="vcenter">
      { showDeleteConfirmation
        ? <RemoveConfirm
          confirmFn={props.confirmDelete}
          confirmMsg={props.confirmMsg}
          deleteData={props.deleteData}
          mini={props.mini}
          title={props.deleteTitle}
        />
        : <div style={{ textAlign: 'right' }}>
          <FloatingActionButton
            mini={props.mini}
            onClick={onClickEdit}
            title="Edit"
          >
            <EditIcon />
          </FloatingActionButton>
          <FloatingActionButton
            mini={props.mini}
            onClick={onClickDelete}
            secondary
            style={{ marginLeft: '10px' }}
            title="Delete"
          >
            <DeleteIcon />
          </FloatingActionButton>
        </div>
      }
    </h2>
  );
}

editDeleteButtons.propTypes = {
  confirmMsg: PropTypes.string,
  clickDelete: PropTypes.func.isRequired,
  clickEdit: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  deleteData: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  deleteTitle: PropTypes.string.isRequired,
  mini: PropTypes.bool,
  showButtons: PropTypes.bool.isRequired,
  showDeleteConfirmation: PropTypes.bool.isRequired,
};

editDeleteButtons.defaultProps = {
  confirmMsg: 'Really delete? (This cannot be undone.)',
  deleteData: {},
  mini: false,
};

module.exports = editDeleteButtons;
