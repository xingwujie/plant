const actions = require('../../actions');
const EditDeleteButtons = require('./EditDeleteButtons');
const NotesRead = require('./NotesRead');
const Paper = require('material-ui/Paper').default;
const React = require('react');
const utils = require('../../libs/utils');

class PlantRead extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.checkDelete = this.checkDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  componentWillMount() {
    const {plant} = this.props;
    if(!plant.get('notes')) {
      const _id = plant.get('_id');
      if(_id) {
        this.props.dispatch(actions.loadPlantRequest({_id}));
      }
    }
  }

  edit() {
    const plant = this.props.plant.toJS();
    const dateFields = ['plantedDate', 'purchasedDate', 'terminatedDate'];
    dateFields.forEach(dateField => {
      if(plant[dateField]) {
        plant[dateField] = utils.intToString(plant[dateField]);
      }
    });
    this.props.dispatch(actions.editPlantOpen({plant, meta: {isNew: false}}));
  }

  checkDelete() {
    this.setState({showDeleteConfirmation: true});
  }

  confirmDelete(yes) {
    if(yes) {
      const {user, plant, locations} = this.props;
      const payload = {
        userId: user.get('_id'),
        plantId: plant.get('_id')
      };
      const location = locations.get(plant.locationId);
      this.props.dispatch(actions.deletePlantRequest(payload));
      if(location) {
        // Transition to /location/:slug/:id
        const locationUrl = utils.makeLocationUrl(location);
        this.context.router.push(locationUrl);
      } else {
        console.warn('Could not find location for locationId', plant.locationId);
      }
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  renderDetails(plant) {
    if(!plant) {
      return null;
    }

    const titles = [
      {name: 'description', text: ''},
      {name: 'commonName', text: 'Common Name'},
      {name: 'botanicalName', text: 'Botanical Name'},
    ];
    const basicTitles = titles.map( title => {
      const value = plant.get(title.name);
      if(!value) {
        return null;
      }
      let renderText = `${title.text ? title.text + ': ' : ''}${value}`;
      return (<div key={title.name}>
        {renderText}
      </div>);
    });

    const dateFormat = 'DD-MMM-YYYY';

    const plantedDate = plant.get('plantedDate');
    if(plantedDate) {
      const date = utils.intToMoment(plantedDate);
      basicTitles.push(
        <div key='plantedDate'>
          {`Planted on ${date.format(dateFormat)} (${date.fromNow()})`}
        </div>
      );
    }

    const isTerminated = plant.get('isTerminated');
    if(isTerminated) {
      const terminatedDate = plant.get('terminatedDate');
      const dateTerminated = terminatedDate
        ? utils.intToMoment(terminatedDate)
        : null;

      basicTitles.push(
        <div key='terminatedDate'>
          {`This plant was terminated${terminatedDate ? ` on ${dateTerminated.format(dateFormat)}` : ''}.`}
        </div>
      );

      if(plantedDate && dateTerminated) {
        const datePlanted = utils.intToMoment(plantedDate);
        if(datePlanted.isBefore(dateTerminated)) {
          basicTitles.push(
            <div key='terminatedDaysAfterPlanting'>
              {`${datePlanted.from(dateTerminated, true)} after it was planted.`}
            </div>
          );
        }
      }

      const terminatedReason = plant.get('terminatedReason', 'unknown');
      if(terminatedReason === 'unknown') {
        console.error('terminatedReason not set', plant.toJS());
      } else {
        basicTitles.push(
          <div key='terminatedReason'>
            {`Reason: ${terminatedReason}`}
          </div>
        );
      }

      const terminatedDescription = plant.get('terminatedDescription');
      if(terminatedDescription) {
        basicTitles.push(
          <div key='terminatedDescription'>
            {`(${terminatedDescription})`}
          </div>
        );
      }
    }

    return basicTitles;
  }

  render() {
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block'
    };

    const {
      isOwner,
      plant,
      user
    } = this.props || {};

    const {
      showDeleteConfirmation = false
    } = this.state || {};

    return (
      <div>
        {plant ?
          <div className='plant'>
            <Paper style={paperStyle} zDepth={1}>
              <h2 className='vcenter' style={{textAlign: 'center'}}>
                {plant.get('title')}
              </h2>
              {this.renderDetails(plant)}
              <EditDeleteButtons
                clickEdit={this.edit}
                clickDelete={this.checkDelete}
                confirmDelete={this.confirmDelete}
                showDeleteConfirmation={showDeleteConfirmation}
                showButtons={isOwner}
                deleteTitle={plant.get('title') || ''}
              />
            </Paper>
            <NotesRead
              dispatch={this.props.dispatch}
              interim={this.props.interim}
              isOwner={isOwner}
              notes={this.props.notes}
              plant={plant}
              plants={this.props.plants}
              user={user}
            />
          </div>
        :
          <div>{'Plant not found or still loading...'}</div>
        }
      </div>
    );
  }
}

PlantRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  interim: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  notes:  React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  locations: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  plant:  React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    toJS: React.PropTypes.func.isRequired,
  }).isRequired,
  plants:  React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  user: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
};

module.exports = PlantRead;
