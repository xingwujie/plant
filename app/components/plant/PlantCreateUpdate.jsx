// Used to add/edit a plant to/in the user's collection
// Url Create: /plant
// Url Update: /plant/<slug>/<plant-id>

import _ from 'lodash';
import Errors from '../Errors';
import LogLifecycle from 'react-log-lifecycle';
import PlantActions from '../../actions/PlantActions';
import React from 'react';

// Optional flags:
const options = {
  // If logType is set to keys then the props of the object being logged
  // will be written out instead of the whole object. Remove logType or
  // set it to anything except keys to have the full object logged.
  logType: 'x',
  // A list of the param "types" to be logged.
  // The example below has all the types.
  names: ['props', 'nextProps', 'nextState', 'prevProps', 'prevState']
};

const plantProps = ['title', 'botanicalName', 'commonName', 'description',
  'purchasedDate', 'plantedDate', 'price'];

// export default AuthRequired(class PlantCreateUpdate extends React.Component {
export default class PlantCreateUpdate extends LogLifecycle {

  constructor(props) {
    super(props, options);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    console.log('PlantCreateUpdate.componentWillMount props', this.props);
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
      console.log('PlantCreateUpdate.cancel edit');
      this.props.setMode('read');
    } else {
      console.log('PlantCreateUpdate.cancel create');
      // TODO: Transition to /plants
    }
  }

  save(e) {
    if(this.state.title) {
      var plant = _.pick(this.state,
        plantProps
      );
      PlantActions.create(plant, (err, savedPlant) => {
        console.log('PlantActions.create cb:', err, savedPlant);
        if(!err) {
          this.props.setMode('read');
        } else {
          const errors = [err.message];
          this.setState({errors});
        }
      });
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
    console.log('PlantCreateUpdate.render props', this.props);
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
