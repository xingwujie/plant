
import * as actions from '../../actions';
import React from 'react';
import RemoveConfirm from '../RemoveConfirm';

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
            <h2 className='vcenter'>
              {isOwner &&
                <div className='pull-right'>
                  <div
                    className='btn btn-default btn-lg'
                    onClick={this.edit}>
                    <span className='glyphicon glyphicon-pencil' aria-hidden='true'></span>
                    Edit
                  </div>
                  <div
                    className='btn btn-default btn-lg'
                    onClick={this.checkDelete}>
                    <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
                    Delete
                  </div>
                </div>
              }
            </h2>
            {showDeleteConfirmation &&
              <RemoveConfirm title={plant.title} confirmFn={this.confirmDelete} />
            }
            <h2 className='vcenter' style={{textAlign: 'center'}}>
              {plant.title}
            </h2>
            {this.renderDetails(plant)}
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
