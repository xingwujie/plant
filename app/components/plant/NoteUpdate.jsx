// Used to update a note in a plant

import React from 'react';
import NoteCreateUpdate from './NoteCreateUpdate';

export default class NoteUpdate extends React.Component {

  render() {
    const {
      isOwner,
      note
    } = this.props || {};

    if(!isOwner) {
      return null;
    }

    return (
      <NoteCreateUpdate
        dispatch={this.props.dispatch}
        plant={this.props.plant}
        plantNote={note}
      />
    );
  }
}

NoteUpdate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
};
