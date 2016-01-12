// Used to add/edit a plant to/in the user's collection
// Url Create: /plant
// Url Update: /plant/<slug>/<plant-id>

import _ from 'lodash';
import {validate} from '../../models/plant';
import * as actions from '../../actions';
import InputCombo from '../InputCombo';
import React from 'react';
import slug from 'slug';

export default class PlantCreateUpdate extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    if(!_.isEmpty(this.props.plant)){
      const pageTitle = this.props.plant.mode === 'edit'
        ? `Edit ${this.props.plant.title}`
        : `Add New Plant`;
      this.setState({...this.props.plant, pageTitle });
    } else {
      this.setState({});
    }
  }

  cancel() {
    if(this.props.plant.mode === 'edit') {
      this.props.dispatch(actions.setPlantMode({
        _id: this.props.plant._id,
        mode: 'read'
      }));
    } else {
      // Transition to /plants
      this.context.history.pushState(null, '/plants');
    }
  }

  save(e) {
    const isNew = this.props.plant.mode === 'create';
    validate(this.state, {isNew}, (err, transformed) => {
      if(err) {
        this.setState({errors: err});
      } else {
        if(isNew) {
          this.props.dispatch(actions.createPlantRequest(transformed));
        } else {
          this.props.dispatch(actions.updatePlantRequest(transformed));
        }
        this.context.history.pushState(null, `/plant/${slug(transformed.title)}/${transformed._id}`);
      }
    });
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
    const {
      title,
      botanicalName,
      commonName,
      description,
      purchasedDate,
      plantedDate,
      price,
      errors = {},
      pageTitle
    } = this.state || {};

    if(!_.isEmpty(errors)) {
      console.log('errors:', errors);
    }

    return (
      <div>
        <h2 style={{textAlign: 'center'}}>{pageTitle}</h2>
          <form className='editor'>

            <InputCombo
              error={errors.title}
              label='Title'
              value={title}
              placeholder={`How do you refer to this plant? (e.g. Washington Navel)`}
              changeHandler={this.handleChange.bind(this, 'title')}
            />

            <div className='col-xs-12'>
              {'The rest of the fields are optional. You can come back and add them later if you want to start adding notes or other plants now.'}
            </div>

            <InputCombo
              error={errors.botanicalName}
              label='Botanical Name'
              value={botanicalName}
              extraClasses='col-sm-6'
              placeholder={`e.g. Citrus sinensis 'Washington Navel'`}
              changeHandler={this.handleChange.bind(this, 'botanicalName')}
            />

            <InputCombo
              error={errors.commonName}
              label='Common Name'
              extraClasses='col-sm-6'
              value={commonName}
              placeholder={`e.g. Washington Navel Orange`}
              changeHandler={this.handleChange.bind(this, 'commonName')}
            />

            <InputCombo
              error={errors.description}
              label='Description'
              value={description}
              placeholder={`Describe this plant and/or the location in your yard`}
              changeHandler={this.handleChange.bind(this, 'description')}
            />

            <InputCombo
              error={errors.purchasedDate}
              extraClasses='col-sm-4'
              label='Purchase Date'
              value={purchasedDate}
              placeholder={`MM/DD/YYYY`}
              changeHandler={this.handleChange.bind(this, 'purchasedDate')}
            />

            <InputCombo
              error={errors.plantedDate}
              extraClasses='col-sm-4'
              label='Planted Date'
              value={plantedDate}
              placeholder={`MM/DD/YYYY`}
              changeHandler={this.handleChange.bind(this, 'plantedDate')}
            />

            <InputCombo
              error={errors.price}
              extraClasses='col-sm-4'
              label='Price'
              value={price}
              placeholder={`$XX.xx`}
              changeHandler={this.handleChange.bind(this, 'price')}
            />

            {!_.isEmpty(errors) && <p className='text-danger col-xs-12'>There were errors. Please check your input.</p>}

            <div className='center-div'>
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

PlantCreateUpdate.propTypes = {
  plant: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  mode: React.PropTypes.string.isRequired
};
