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
    const {plant = {}} = this.props || {};
    if(!plant.notes) {
      const {_id} = plant;
      if(_id) {
        this.props.dispatch(actions.loadPlantRequest({_id}));
      }
    }
  }

  edit() {
    const {plant} = this.props;
    this.props.dispatch(actions.editPlantOpen({plant, meta: {isNew: false}}));
  }

  checkDelete() {
    this.setState({showDeleteConfirmation: true});
  }

  confirmDelete(yes) {
    if(yes) {
      this.props.dispatch(actions.deletePlantRequest(this.props.plant._id));
      // Transition to /plants/:slug/:id
      const plantUrl = utils.makePlantsUrl(this.props.user);
      this.context.router.push(plantUrl);
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  renderDetails(plant) {
    const titles = [
      {name: 'description', text: ''},
      {name: 'commonName', text: 'Common Name'},
      {name: 'botanicalName', text: 'Botanical Name'},
      {name: 'plantedDate', text: 'Planted On'},
    ];
    if(!plant) {
      return null;
    }
    return titles.map( title => {
      if(!plant[title.name]) {
        return null;
      }
      let renderText;
      if(title.name === 'plantedDate' && plant[title.name]) {
        const date = utils.intToMoment(plant[title.name]);
        renderText = `Planted ${date.fromNow()}`;
      } else {
        renderText = `${title.text ? title.text + ': ' : ''}${plant[title.name]}`;
      }
      return (<div key={title.name}>
        {renderText}
      </div>);
    });

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
        {!plant &&
          <div>{'Plant not found or still loading...'}</div>
        }
        {plant &&
          <div className='plant'>
            <Paper style={paperStyle} zDepth={1}>
              <h2 className='vcenter' style={{textAlign: 'center'}}>
                {plant.title}
              </h2>
              {this.renderDetails(plant)}
              <EditDeleteButtons
                clickEdit={this.edit}
                clickDelete={this.checkDelete}
                confirmDelete={this.confirmDelete}
                showDeleteConfirmation={showDeleteConfirmation}
                showButtons={isOwner}
                deleteTitle={plant.title || ''}
              />
            </Paper>
            <NotesRead
              dispatch={this.props.dispatch}
              interim={this.props.interim}
              isOwner={isOwner}
              notes={this.props.notes}
              plant={plant}
              user={user}
            />
          </div>
        }
      </div>
    );
  }
}

PlantRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  interim: React.PropTypes.shape({
    note: React.PropTypes.shape({
      note: React.PropTypes.object.isRequired,
      plant: React.PropTypes.object.isRequired,
    })
  }).isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  notes: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

module.exports = PlantRead;
