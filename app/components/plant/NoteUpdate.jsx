// Used to update a note in a plant

const React = require('react');
const NoteEdit = require('./NoteEdit');
const PropTypes = require('prop-types');

class NoteUpdate extends React.Component {

  render() {
    if(!this.props.isOwner) {
      return null;
    }

    return (
      <NoteEdit
        dispatch={this.props.dispatch}
        interimNote={this.props.interimNote}
        plant={this.props.plant}
        plants={this.props.plants}
        user={this.props.user}
      />
    );
  }
}

NoteUpdate.propTypes = {
  dispatch: PropTypes.func.isRequired,
  interimNote: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  isOwner: PropTypes.bool.isRequired,
  plant: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  plants: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({ // Immutable.js Map
    get: PropTypes.func.isRequired,
  }).isRequired
};

module.exports = NoteUpdate;
