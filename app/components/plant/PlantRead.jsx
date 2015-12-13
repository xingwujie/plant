
// import LogLifecycle from 'react-log-lifecycle';
import React from 'react';

export default class PlantRead extends React.Component {

  constructor(props) {
    super(props);
    // this.edit = this.props.edit;
    this.delete = this.delete.bind(this);
  }

  delete() {
    // TODO: Pop up a warning and then call delete
    console.log('delete props:', this.props);
  }

  render() {
    console.log('PlantRead.render props/state:', this.props, this.state);
    let {
      isOwner,
      plant,
      edit
    } = this.props || {};

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
                    onClick={edit}>
                    <span className='glyphicon glyphicon-pencil' aria-hidden='true'></span>
                    Edit
                  </div>
                  <div
                    className='btn btn-default btn-lg'
                    onClick={this.delete}>
                    <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
                    Delete
                  </div>
                </div>
              }
            </h2>
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
