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
        interimNote={interimNote}
        plant={this.props.plant}
        plants={this.props.plants}
        user={this.props.user}
      />
    );
  }
}

NoteUpdate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  interimNote: React.PropTypes.object.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant: React.PropTypes.object.isRequired,
  plants: React.PropTypes.object.isRequired, // Immutable.js Map
  user: React.PropTypes.shape({ // Immutable.js Map
    get: React.PropTypes.func.isRequired,
  }).isRequired
};

module.exports = NoteUpdate;
