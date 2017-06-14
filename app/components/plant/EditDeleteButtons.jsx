const React = require('react');
const RemoveConfirm = require('../RemoveConfirm');
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

  return (
    <h2 className="vcenter">
      { showDeleteConfirmation
        ? <RemoveConfirm title={props.deleteTitle} confirmFn={props.confirmDelete} />
        : <div style={{ textAlign: 'right' }}>
          <FloatingActionButton
            onClick={props.clickEdit}
            title="Edit"
          >
            <EditIcon />
          </FloatingActionButton>
          <FloatingActionButton
            onClick={props.clickDelete}
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
  clickDelete: PropTypes.func.isRequired,
  clickEdit: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  deleteTitle: PropTypes.string.isRequired,
  showButtons: PropTypes.bool.isRequired,
  showDeleteConfirmation: PropTypes.bool.isRequired,
};

module.exports = editDeleteButtons;
