
import _ from 'lodash';
import React from 'react';
import RemoveConfirm from '../RemoveConfirm';

export default class PlantRead extends React.Component {

  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.checkDelete = this.checkDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  edit() {
    console.log('edit:', this.props);
    this.props.setMode('edit');
  }

  checkDelete() {
    console.log('checkDelete');
    this.setState({confirmRemove: true});
  }

  confirmDelete(yes) {
    console.log('confirmDelete:', yes);
    if(yes) {
      // TODO: Delete this record
    } else {
      this.setState({confirmRemove: false});
    }
  }

  render() {
    console.log('PlantRead.render props/state:', this.props, this.state);
    let {
      isOwner,
      plant
    } = this.props || {};

    const confirmRemove = _.get(this, 'state.confirmRemove');
    console.log('PlantRead confirmRemove:', confirmRemove);

    return (
      <div>
        {!plant &&
          <div>{`Plant not found or still loading...`}</div>
        }
        {plant &&
          <div className='plant'>
            <h2 className='vcenter'>
              {plant.title}
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
            {confirmRemove &&
              <RemoveConfirm title={plant.title} confirmFn={this.confirmDelete} />
            }
            {plant.description &&
              <p>{plant.description}</p>
            }
            {plant.commonName &&
              <p>Common Name: {plant.commonName}</p>
            }
            {plant.botanicalName &&
              <p>Botanical Name: {plant.botanicalName}</p>
            }
            {plant.purchasedDate &&
              <p>Bought On: {plant.purchasedDate}</p>
            }
          </div>
        }
      </div>
    );
  }
}
