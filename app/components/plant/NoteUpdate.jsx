// Used to update a note in a plant

import React from 'react';
import NoteCreateUpdate from './NoteCreateUpdate';

export default class NoteUpdate extends React.Component {

  render() {
    const {
      isOwner,
      interimNote
    } = this.props || {};

    if(!isOwner) {
      return null;
    }

    return (
      <NoteCreateUpdate
        dispatch={this.props.dispatch}
        plant={this.props.plant}
        interimNote={interimNote}
      />
    );
  }
}

NoteUpdate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  interimNote: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
};
