import React from 'react';
import RemoveConfirm from '../RemoveConfirm';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

export default class EditDeleteButtons extends React.Component {

  render() {

    let {
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
            >
              <EditIcon />
            </FloatingActionButton>
            <FloatingActionButton
              onClick={this.props.clickDelete}
              secondary={true}
              style={{marginLeft: '10px'}}
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
