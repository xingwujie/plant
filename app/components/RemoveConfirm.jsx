
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
      <div className='pull-right delete'>
        <strong className='lead'>{'This cannot be undone. Really delete?'}</strong>
        <button onClick={this.reallyDelete} className='btn btn-danger'>{`Delete ${title}`}</button>
        <button onClick={this.cancelDelete} className='btn btn-info'>{`Cancel`}</button>
      </div>
    );
  }
}
