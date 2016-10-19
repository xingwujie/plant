// Used to show each plant on a user's plant list page.
// Url: /plants/<optional-user-id>
const {Link} = require('react-router');
const {makeSlug} = require('../../libs/utils');
const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const AddIcon = require('material-ui/svg-icons/content/add').default;
const utils = require('../../libs/utils');
const actions = require('../../actions');
const moment = require('moment');

class PlantItem extends React.Component {

  constructor() {
    super();
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
    };

    if(!plant.has('notes')) {
      this.props.dispatch(actions.loadNotesRequest({
        plantId: plant.get('_id')
      }));
    }

    this.props.dispatch(actions.editNoteOpen({note, plant: plant.toJS()}));
  }

  render() {
    const {
      isOwner = false,
      plant
    } = this.props;

    const _id = plant.get('_id');
    const title = plant.get('title');

    const floatingActionButtonStyle = {
      marginLeft: '10px',
      width: '50px',
      // 0 = don't grow, 0 = don't shrink, 50px = start at this size
      flex: '0 0 50px'
    };

    const link = `/plant/${makeSlug(title)}/${_id}`;
    const renderLink = (
      <Link
        style={{margin: '20px'}}
        to={link}
      >
        <span>{title}</span>
      </Link>
    );

    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        {isOwner &&
          <div style={floatingActionButtonStyle}>
            <FloatingActionButton
              mini={true}
              onClick={this.createNote}
              title='Add Note'
            >
              <AddIcon />
            </FloatingActionButton>
          </div>
        }
        {renderLink}
      </div>
    );
  }
}

PlantItem.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant:  React.PropTypes.shape({ // Immutable.js
    get: React.PropTypes.func.isRequired,
  }).isRequired
};

module.exports = PlantItem;
