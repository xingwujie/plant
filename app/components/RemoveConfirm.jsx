import _ from 'lodash';
import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';

export default class RemoveConfirm extends React.Component {

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
    const title = _.get(this.props, 'title', '');

    return (
      <div style={{textAlign: 'right'}}>
        <strong className='lead'>{'Really delete? (This cannot be undone.)'}</strong>
        <FloatingActionButton
          onClick={this.cancelDelete}
          secondary={true}
          style={{marginLeft: '10px'}}
          title='Cancel'
        >
          <ClearIcon />
        </FloatingActionButton>
        <FloatingActionButton
          onClick={this.reallyDelete}
          primary={true}
          style={{marginLeft: '10px'}}
          title={`Delete ${title}`}
        >
          <DeleteForeverIcon />
        </FloatingActionButton>
      </div>
    );
  }
}

RemoveConfirm.propTypes = {
  confirmFn: React.PropTypes.func.isRequired,
};
