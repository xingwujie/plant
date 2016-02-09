import * as actions from '../../actions';
import EditDeleteButtons from './EditDeleteButtons';
import NotesRead from './NotesRead';
import Paper from 'material-ui/lib/paper';
import React from 'react';

export default class PlantRead extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
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
      this.props.dispatch(actions.loadPlant({_id}));
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
      // Transition to /plants
      this.context.history.pushState(null, '/plants');
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  renderDetails(plant) {
    const titles = [
      {name: 'description', text: ''},
      {name: 'commonName', text: 'Common Name'},
      {name: 'botanicalName', text: 'Botanical Name'},
      {name: 'purchasedDate', text: 'Bought On'},
    ];
    if(!plant) {
      return null;
    }
    return titles.map( title => {
      if(!plant[title.name]) {
        return null;
      }
      return (<h3 key={title.name}>
        {`${title.text ? title.text + ': ' : ''}${plant[title.name]}`}
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

    let {
      isOwner,
      plant
    } = this.props || {};

    const {
      showDeleteConfirmation = false
    } = this.state || {};

    return (
      <div>
        {!plant &&
          <div>{`Plant not found or still loading...`}</div>
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
                showButtons={isOwner && !plant.createNote}
                deleteTitle={plant.title || ''}
              />
            </Paper>
            <NotesRead notes={plant.notes} />
          </div>
        }
      </div>
    );
  }
}

PlantRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant: React.PropTypes.object.isRequired,
};
