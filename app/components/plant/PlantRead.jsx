import * as actions from '../../actions';
import EditDeleteButtons from './EditDeleteButtons';
import NotesRead from './NotesRead';
import Paper from 'material-ui/Paper';
import React from 'react';
import moment from 'moment';
import * as utils from '../../libs/utils';

export default class PlantRead extends React.Component {
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
        this.props.dispatch(actions.loadPlant({_id}));
      }
    }
  }

  edit() {
    this.props.dispatch(actions.setPlantMode({
      _id: this.props.plant._id,
      mode: 'edit'
    }));
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
      if(title.name === 'plantedDate' && moment.isMoment(plant[title.name])) {
        renderText = `Planted ${plant[title.name].fromNow()}`;
      } else {
        renderText = `${title.text ? title.text + ': ' : ''}${plant[title.name]}`;
      }
      return (<h3 key={title.name}>
        {renderText}
      </h3>);
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
            <Paper style={paperStyle} zDepth={5}>
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
              notes={this.props.notes}
              plant={plant}
              user={user}
              isOwner={isOwner}
            />
          </div>
        }
      </div>
    );
  }
}

PlantRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  notes: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};
