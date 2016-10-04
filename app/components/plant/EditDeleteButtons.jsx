const React = require('react');
const RemoveConfirm = require('../RemoveConfirm');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const EditIcon = require('material-ui/svg-icons/editor/mode-edit').default;
const DeleteIcon = require('material-ui/svg-icons/action/delete').default;

class EditDeleteButtons extends React.Component {

  render() {

    const {
      showButtons,
      showDeleteConfirmation,
    } = this.props || {};

    if(!showButtons) {
      return null;
    }

    return (
      <h2 className='vcenter'>
        {!showDeleteConfirmation &&
          <div style={{textAlign: 'right'}}>
            <FloatingActionButton
              onClick={this.props.clickEdit}
              title='Edit'
            >
              <EditIcon />
            </FloatingActionButton>
            <FloatingActionButton
              onClick={this.props.clickDelete}
              secondary={true}
              style={{marginLeft: '10px'}}
              title='Delete'
            >
              <DeleteIcon />
            </FloatingActionButton>
          </div>
        }
        {showDeleteConfirmation &&
          <RemoveConfirm title={this.props.deleteTitle} confirmFn={this.props.confirmDelete} />
        }
      </h2>
    );
  }
}

EditDeleteButtons.propTypes = {
  clickDelete: React.PropTypes.func.isRequired,
  clickEdit: React.PropTypes.func.isRequired,
  confirmDelete: React.PropTypes.func.isRequired,
  deleteTitle: React.PropTypes.string.isRequired,
  // dispatch: React.PropTypes.func.isRequired,
  showButtons: React.PropTypes.bool.isRequired,
  showDeleteConfirmation: React.PropTypes.bool.isRequired,
};

module.exports = EditDeleteButtons;
