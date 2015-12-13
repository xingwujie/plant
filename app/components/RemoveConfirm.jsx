
import _ from 'lodash';
import React from 'react';

export default class RemoveConfirm extends React.Component {

  constructor(props) {
    super(props);
    this.reallyDelete = this.reallyDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }

  reallyDelete() {
    console.log('reallyDelete props:', this.props);
    this.props.confirmFn(true);
  }

  cancelDelete() {
    console.log('confirmDelete props:', this.props);
    this.props.confirmFn(false);
  }

  render() {
    console.log('RemoveConfirm.render');
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
