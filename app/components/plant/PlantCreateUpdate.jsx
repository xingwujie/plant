// Used to add/edit a plant to/in the user's collection
// Url Create: /plant
// Url Update: /plant/<slug>/<plant-id>

import _ from 'lodash';
import Errors from '../Errors';
import PlantActions from '../../actions/PlantActions';
import React from 'react';

const plantProps = ['_id', 'type', 'userId', 'title', 'botanicalName',
  'commonName', 'description', 'purchasedDate', 'plantedDate', 'price'];

export default class PlantCreateUpdate extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    if(!_.isEmpty(this.props.plant)){
      const pageTitle = this.props.mode === 'edit'
        ? `Edit ${this.props.plant.title}`
        : `Add New Plant`;
      this.setState(_.assign({}, this.props.plant, {pageTitle}));
    } else {
      this.setState({});
    }
  }

  cancel() {
    if(this.props.mode === 'edit') {
      this.props.setMode('read');
    } else {
      // Transition to /plants
      this.context.history.pushState(null, '/plants');
    }
  }

  save(e) {
    if(this.state.title) {
      var plant = _.pick(this.state,
        plantProps
      );
      if(this.props.mode === 'edit') {
        PlantActions.update(plant);
      } else {
        PlantActions.create(plant);
      }
    } else {
      this.setState({errors: ['Must have Title']});
    }
    e.preventDefault();
    e.stopPropagation();
    // TODO: Open Plant page and allow for adding of a note.
  }

  handleChange(propName, e) {
    // List check box names in here.
    const checkBoxes = [];
    var change = {
      [propName]: _.contains(checkBoxes, propName) ? e.target.checked : e.target.value
    };
    this.setState(change);
  }

  render() {
    var {
      title,
      botanicalName,
      commonName,
      description,
      purchasedDate,
      plantedDate,
      price,
      errors,
      pageTitle
    } = this.state || {};

    return (
      <div>
        <h2 style={{textAlign: 'center'}}>{pageTitle}</h2>
          <form className='editor'>

            <div className='form-group title-input-combo col-xs-12'>
              <label>Title:</label>
              <input autoFocus className='form-control'
                type='text' value={title}
                placeholder='How do you refer to this plant? (e.g. Washington Navel)'
                onChange={this.handleChange.bind(this, 'title')} />
            </div>

            <div className='col-xs-12'>
              {'The rest of the fields are optional. You can come back and add them later if you want to start adding notes or other plants now.'}
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-6'>
              <label>Botanical Name:</label>
              <input className='form-control'
                type='text' value={botanicalName}
                placeholder={'e.g. Citrus sinensis \'Washington Navel\''}
                onChange={this.handleChange.bind(this, 'botanicalName')} />
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-6'>
              <label>Common Name:</label>
              <input className='form-control'
                type='text' value={commonName}
                placeholder='e.g. Washington Navel Orange'
                onChange={this.handleChange.bind(this, 'commonName')} />
            </div>

            <div className='form-group title-input-combo col-xs-12'>
              <label>Description:</label>
              <textarea className='form-control'
                rows='2' value={description}
                placeholder='Describe this plant and/or the location in your yard'
                onChange={this.handleChange.bind(this, 'description')} />
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-4'>
              <label>Purchase Date:</label>
              <input className='form-control'
                type='text' value={purchasedDate}
                placeholder='MM/DD/YYYY'
                onChange={this.handleChange.bind(this, 'purchasedDate')} />
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-4'>
              <label>Planted Date:</label>
              <input className='form-control'
                type='text' value={plantedDate}
                placeholder='MM/DD/YYYY'
                onChange={this.handleChange.bind(this, 'plantedDate')} />
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-4'>
              <label>Price:</label>
              <input className='form-control'
                type='text' value={price}
                placeholder='$XX.xx'
                onChange={this.handleChange.bind(this, 'price')} />
            </div>

            <div className='center-div'>
              <Errors errors={errors} />

              <div className='form-group col-xs-12 btn-group' style={{textAlign: 'center'}}>
                <button className='btn btn-success btn-lg' type='button' onClick={this.save.bind(this)}>Save</button>
                <button className='btn btn-info btn-lg' type='button' onClick={this.cancel.bind(this)}>Cancel</button>
              </div>
            </div>

          </form>
      </div>
    );
  }
};
