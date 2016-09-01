import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DoneIcon from 'material-ui/svg-icons/action/done';

export default class CancelSaveButtons extends React.Component {

  render() {

    const {
      showButtons,
    } = this.props || {};

    if(!showButtons) {
      return null;
    }

    return (
      <h2 className='vcenter'>
        <div style={{textAlign: 'right'}}>
          <FloatingActionButton
            onClick={this.props.clickCancel}
            secondary={true}
            title='Cancel'
          >
            <ClearIcon />
          </FloatingActionButton>
          <FloatingActionButton
            onClick={this.props.clickSave}
            style={{marginLeft: '10px'}}
            title='Save'
          >
            <DoneIcon />
          </FloatingActionButton>
        </div>
      </h2>
    );
  }
}

CancelSaveButtons.propTypes = {
  clickSave: React.PropTypes.func.isRequired,
  clickCancel: React.PropTypes.func.isRequired,
  showButtons: React.PropTypes.bool.isRequired,
};
