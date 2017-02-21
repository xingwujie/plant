// Used to update a note in a plant

const React = require('react');
const NoteEdit = require('./NoteEdit');

class NoteUpdate extends React.Component {

  render() {
    console.log('NoteUpdate.render');
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
  dispatch: React.PropTypes.func.isRequired,
  interimNote: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  plants: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  user: React.PropTypes.shape({ // Immutable.js Map
    get: React.PropTypes.func.isRequired,
  }).isRequired
};

module.exports = NoteUpdate;
