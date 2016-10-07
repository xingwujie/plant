// Used to update a note in a plant

const React = require('react');
const NoteCreateUpdate = require('./NoteCreateUpdate');

class NoteUpdate extends React.Component {

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
        plants={this.props.plants}
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
  plants: React.PropTypes.object.isRequired, // Immutable.js Map
  user: React.PropTypes.object.isRequired, // Immutable.js Map
};

module.exports = NoteUpdate;
