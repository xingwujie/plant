// Used to add/edit a plant to/in the user's collection
// Url Create: /plant
// Url Update: /plant/<slug>/<plant-id>

import _ from 'lodash';
import {validate} from '../../models/plant';
// import Errors from '../Errors';
// import PlantActions from '../../actions/PlantActions';
import React from 'react';
import InputCombo from '../InputCombo';

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
    const isNew = this.props.mode === 'create';
    const isClient = true;
    validate(this.state, {isNew, isClient}, (err, transformed) => {
      if(err) {
        this.setState({errors: err});
      } else {
        this.props.save(transformed);
        if(isNew) {
          // PlantActions.create(transformed);
        } else {
          // PlantActions.update(transformed);
        }
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
    errors = errors || {};

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
