// import * as actions from '../../actions';
import RaisedButton from 'material-ui/lib/raised-button';
import React from 'react';
import RemoveConfirm from '../RemoveConfirm';

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
            <RaisedButton
              label='Edit'
              onClick={this.props.clickEdit}
            />
            <RaisedButton
              label='Delete'
              onClick={this.props.clickDelete}
              style={{marginLeft: '10px'}}
            />
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
