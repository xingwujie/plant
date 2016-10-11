// Used to add a note to a plant

const actions = require('../../actions');
const React = require('react');
const NoteCreateUpdate = require('./NoteCreateUpdate');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const AddIcon = require('material-ui/svg-icons/content/add').default;
const utils = require('../../libs/utils');
const moment = require('moment');

class NoteCreate extends React.Component {

  constructor(props) {
    super(props);

    this.createNote = this.createNote.bind(this);
  }

  createNote() {
    const {plant} = this.props;
    const note = {
      _id: utils.makeMongoId(),
      date: moment().format('MM/DD/YYYY'),
      isNew: true,
      note: '',
      plantIds: [plant.get('_id')],
      errors: {},
      plants: this.props.plants.filter(p => p.get('userId') === this.props.user.get('_id'))
    };

    this.props.dispatch(actions.editNoteOpen({note, plant}));
  }

  render() {
    const {
      isOwner,
      interimNote
    } = this.props;

    if(!isOwner) {
      return null;
    }

    const createNote = interimNote.get('isNew');

    return (
      <div>
        {createNote &&
          <NoteCreateUpdate
            dispatch={this.props.dispatch}
            interimNote={interimNote}
            plant={this.props.plant}
            plants={this.props.plants}
            user={this.props.user}
          />
        }
        {!createNote &&
          <div style={{textAlign: 'right'}}>
            <FloatingActionButton
              onClick={this.createNote}
              secondary={true}
              title='Create Note'
            >
              <AddIcon />
            </FloatingActionButton>
          </div>
        }
      </div>
    );
  }
}

NoteCreate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  interimNote: React.PropTypes.shape({ // Immutable.js Map
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  plant: React.PropTypes.shape({ // Immutable.js Map
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  plants: React.PropTypes.shape({ // Immutable.js Map
    get: React.PropTypes.func.isRequired,
    filter: React.PropTypes.func.isRequired,
  }).isRequired,
  postSaveSuccess: React.PropTypes.func,
  user: React.PropTypes.shape({ // Immutable.js Map
    get: React.PropTypes.func.isRequired,
  }).isRequired
};

module.exports = NoteCreate;
