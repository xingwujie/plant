import RaisedButton from 'material-ui/lib/raised-button';
import _ from 'lodash';
import React from 'react';

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
        <strong className='lead'>{'This cannot be undone. Really delete?'}</strong>
        <RaisedButton
          label='Cancel'
          onClick={this.cancelDelete}
          style={{marginLeft: '10px'}}
        />
        <RaisedButton
          label={`Delete ${title}`}
          onClick={this.reallyDelete}
          style={{marginLeft: '10px'}}
        />
      </div>
    );
  }
}
